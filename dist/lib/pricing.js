"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuccessfulPayment = handleSuccessfulPayment;
exports.createOrUpdateInvoice = createOrUpdateInvoice;
exports.findOrCreateUser = findOrCreateUser;
exports.getPricingTier = getPricingTier;
exports.updateOrCreateSubscription = updateOrCreateSubscription;
exports.getSubscriptionEndDate = getSubscriptionEndDate;
exports.mapStripePaymentMethodToEnum = mapStripePaymentMethodToEnum;
const client_1 = __importDefault(require("@/prisma/client"));
const client_2 = require("@prisma/client");
async function handleSuccessfulPayment(charge) {
    const { id: chargeId, amount, customer, payment_method, receipt_email, billing_details, } = charge;
    const user = await findOrCreateUser(receipt_email, billing_details?.email, customer);
    if (!user) {
        throw new Error("Unable to find or create user");
    }
    const pricingTier = await getPricingTier("Premium Plan");
    if (!pricingTier) {
        throw new Error("Pricing tier not found");
    }
    const subscription = await updateOrCreateSubscription(user, pricingTier);
    if (!user.subscriptionId) {
        await client_1.default.user.update({
            where: { id: user.id },
            data: { subscriptionId: subscription.id },
        });
    }
    await createOrUpdateInvoice(user.id, subscription.id, amount, payment_method, charge.payment_method_details, chargeId);
}
async function createOrUpdateInvoice(userId, subscriptionId, amount, paymentMethod, paymentMethodDetails, chargeId) {
    const paymentMethodType = mapStripePaymentMethodToEnum(paymentMethodDetails?.type);
    const last4 = paymentMethodDetails?.card?.last4 || "";
    // Check if an invoice for this charge already exists
    const existingInvoice = await client_1.default.invoice.findFirst({
        where: {
            userId,
            subscriptionId,
            amount: amount / 100,
            paymentMethod: paymentMethod,
            stripeChargeId: chargeId,
        },
    });
    if (existingInvoice) {
        // If the invoice exists, update it if necessary
        return await client_1.default.invoice.update({
            where: { id: existingInvoice.id },
            data: {
                status: "PAID",
                paymentType: paymentMethodType,
                lastFourCardDigits: last4,
                updatedAt: new Date(),
            },
        });
    }
    else {
        // If the invoice doesn't exist, create a new one
        return await client_1.default.invoice.create({
            data: {
                userId,
                subscriptionId,
                amount: amount / 100,
                status: "PAID",
                paymentMethod: paymentMethod,
                paymentType: paymentMethodType,
                lastFourCardDigits: last4,
                paidAt: new Date(),
                stripeChargeId: chargeId,
            },
        });
    }
}
async function findOrCreateUser(receiptEmail, billingEmail, customerId) {
    const user = await client_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: {
                        in: [receiptEmail, billingEmail].filter(Boolean),
                    },
                },
                { subscriptionId: customerId },
            ].filter((condition) => Object.keys(condition).length > 0),
        },
    });
    if (user)
        return user;
    throw new Error("User not found");
}
async function getPricingTier(tierName) {
    return await client_1.default.pricingTier.findFirst({
        where: { name: tierName },
    });
}
async function updateOrCreateSubscription(user, pricingTier) {
    const currentDate = new Date();
    const subscriptionEndDate = getSubscriptionEndDate(currentDate, pricingTier.billingCycle);
    let subscription = user.subscriptionId
        ? await client_1.default.subscription.findUnique({
            where: { id: user.subscriptionId },
            include: { pricingTier: true },
        })
        : null;
    if (subscription) {
        return await client_1.default.subscription.update({
            where: { id: subscription.id },
            data: {
                status: "ACTIVE",
                currentPeriodStart: currentDate,
                currentPeriodEnd: subscriptionEndDate,
            },
            include: { pricingTier: true },
        });
    }
    else {
        return await client_1.default.subscription.create({
            data: {
                status: "ACTIVE",
                currentPeriodStart: currentDate,
                currentPeriodEnd: subscriptionEndDate,
                type: pricingTier.type,
                name: `${pricingTier.name} Subscription`,
                pricingTierId: pricingTier.id,
                users: {
                    connect: { id: user.id },
                },
            },
            include: { pricingTier: true },
        });
    }
}
function getSubscriptionEndDate(startDate, billingCycle) {
    const endDate = new Date(startDate);
    switch (billingCycle) {
        case "MONTHLY":
            endDate.setMonth(endDate.getMonth() + 1);
            break;
        case "YEARLY":
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        default:
            throw new Error(`Unknown billing cycle: ${billingCycle}`);
    }
    return endDate;
}
function mapStripePaymentMethodToEnum(stripePaymentMethod) {
    switch (stripePaymentMethod) {
        case "card":
            return client_2.PaymentMethodType.CREDIT_CARD;
        case "paypal":
            return client_2.PaymentMethodType.PAYPAL;
        case "bank_transfer":
            return client_2.PaymentMethodType.BANK_TRANSFER;
        default:
            return client_2.PaymentMethodType.CREDIT_CARD;
    }
}
