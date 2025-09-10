import { optionalStringQueryToPrisma } from "persistence/common/mappers";
import { mapPrismaClassToBusiness } from "../mappers";
import { ClassRepository } from "./class.repository";
import { PAGE_SIZE, prisma } from "config";
import { offset } from "persistence/common/repositories";

export const classPrismaRepository: ClassRepository = {
  async add(data) {
    const record = await prisma.class.create({
      data,
    });

    return mapPrismaClassToBusiness(record);
  },

  async delete(id) {
    const record = await prisma.class.delete({
      where: { id },
    });

    return mapPrismaClassToBusiness(record);
  },

  async get(id) {
    const record = await prisma.class.findUnique({
      where: { id },
    });

    return record ? mapPrismaClassToBusiness(record) : undefined;
  },

  async update(data) {
    const record = await prisma.class.update({
      where: { id: data.id },
      data,
    });

    return mapPrismaClassToBusiness(record);
  },

  async getBy(criteria) {
    const { page, section, subject, className, ...rest } = criteria;

    const where = {
      ...rest,
      section: optionalStringQueryToPrisma(section),
      subject: optionalStringQueryToPrisma(subject),
      className: optionalStringQueryToPrisma(className),
    };

    const [totalRecords, rawResults] = await Promise.all([
      prisma.class.count({ where }),
      prisma.class.findMany({
        where,
        skip: offset(PAGE_SIZE, page),
        take: PAGE_SIZE,
      }),
    ]);

    const results = rawResults.map(mapPrismaClassToBusiness);

    return {
      page,
      totalPages: Math.ceil(totalRecords / PAGE_SIZE),
      criteria,
      results,
    };
  },
};
