import { prisma } from "../../src/utils/db.server";

export async function search(query: string) {
  const results = await prisma.$queryRaw`
        SELECT
        'Market' AS type,
        m.name AS market_name,
        NULL AS product_name
      FROM public."Market" m
      WHERE m.name ILIKE '%' || ${query} || '%'

      UNION ALL

      SELECT
        'Product' AS type,
        m.name AS market_name,
        p.name AS product_name
      FROM public."Price" pr
      JOIN public."Product" p ON pr.product_id = p.id
      JOIN public."Market" m ON pr.market_id = m.id
      WHERE p.name ILIKE '%' || ${query} || '%'
      GROUP BY m.name, p."name" 
  `;
  return results;
}
