import prisma from "@/prisma/database"

export async function CreateNewContact(name: string, email: string, phone: string, subject: string, message: string) {
    try {
        const data = await prisma.contacts.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message
            }
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function GetAllContactUsMessages(page?: number) {
    if (!page) page = 1
    try {
        const data = await prisma.contacts.findMany({
            skip: (page - 1) * 50,
            take: 50
        })
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function GetContactUsMessagesCount() {
    try {
        const data = await prisma.contacts.count()
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function GetContactUsMessageById(id: string) {
    try {
        const data = await prisma.contacts.findUnique({
            where: {
                id: id
            }
        })
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}