import prisma from '../../lib/prisma';

const ensureUserId = (userId?: string) => {
    if (!userId) {
        throw new Error('Unauthorized');
    }
};

const validateCreateAddressPayload = (address: any) => {
    const { name, phone_number, district, province_id, province_name, street, isdefault } = address;

    return {
        name,
        phone_number,
        district,
        province_id,
        province_name,
        street,
        isdefault,
    };
};

const setNewestAddressAsDefaultIfNeeded = async (userId: string) => {
    const hasDefault = await prisma.address.findFirst({
        where: { user_id: userId, isdefault: true },
        select: { id: true },
    });

    if (hasDefault) {
        return;
    }

    const fallback = await prisma.address.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        select: { id: true },
    });

    if (fallback) {
        await prisma.address.update({
            where: { id: fallback.id },
            data: { isdefault: true },
        });
    }
};

export const createAddress = async (userId: string, address: any) => {
    ensureUserId(userId);

    const { name, phone_number, district, province_id, province_name, street, isdefault } =
        validateCreateAddressPayload(address);
    const hasAddress = await prisma.address.count({ where: { user_id: userId } });
    const shouldBeDefault = isdefault === true || hasAddress === 0;

    if (shouldBeDefault) {
        const created = await prisma.$transaction(async (tx) => {
            await tx.address.updateMany({
                where: { user_id: userId },
                data: { isdefault: false },
            });

            return tx.address.create({
                data: {
                    name,
                    phone_number,
                    district,
                    province_id,
                    province_name,
                    street,
                    isdefault: true,
                    user_id: userId,
                },
            });
        });

        return created;
    }

    const created = await prisma.address.create({
        data: {
            name,
            phone_number,
            district,
            province_id,
            province_name,
            street,
            isdefault: false,
            user_id: userId,
        },
    });

    return created;
};

export const getAddressByUserId = async (userId: string) => {
    ensureUserId(userId);
    const addresses = await prisma.address.findMany({
        where: { user_id: userId },
        orderBy: [{ isdefault: 'desc' }, { created_at: 'desc' }],
    });
    return addresses;
};

export const deleteAddress = async (addressId: string, userId: string) => {
    ensureUserId(userId);

    const address = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!address || address.user_id !== userId) {
        throw new Error('Address not found or unauthorized');
    }

    await prisma.$transaction(async (tx) => {
        await tx.address.delete({
            where: { id: addressId },
        });

        if (address.isdefault) {
            const fallback = await tx.address.findFirst({
                where: { user_id: userId },
                orderBy: { created_at: 'desc' },
                select: { id: true },
            });

            if (fallback) {
                await tx.address.update({
                    where: { id: fallback.id },
                    data: { isdefault: true },
                });
            }
        }
    });

    return;
};

export const updateAddress = async (addressId: string, userId: string, address: any) => {
    ensureUserId(userId);

    const existingAddress = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!existingAddress || existingAddress.user_id !== userId) {
        throw new Error('Address not found or unauthorized');
    }

    const { name, phone_number, district, province_id, province_name, street, isdefault } = address;

    if (isdefault === true) {
        const updated = await prisma.$transaction(async (tx) => {
            await tx.address.updateMany({
                where: { user_id: userId },
                data: { isdefault: false },
            });

            return tx.address.update({
                where: { id: addressId },
                data: {
                    name,
                    phone_number,
                    district,
                    province_id,
                    province_name,
                    street,
                    isdefault: true,
                },
            });
        });

        return updated;
    }

    const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
            name,
            phone_number,
            district,
            province_id,
            province_name,
            street,
            isdefault,
        },
    });

    if (existingAddress.isdefault && isdefault === false) {
        await setNewestAddressAsDefaultIfNeeded(userId);
        return prisma.address.findUnique({
            where: { id: addressId },
        });
    }

    return updatedAddress;
};
