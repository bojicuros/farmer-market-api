import { prisma } from "../../src/utils/db.server";

export async function search(query: string) {
  const results = await prisma.$queryRaw`
    SELECT * FROM (
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
        p."name"  AS product_name
      FROM public."ProductPriceHistory" pph 
      JOIN public."Product" p ON pph.product_id = p.id
      JOIN public."Market" m ON pph.market_id = m.id
      WHERE p.name ILIKE '%' || ${query} || '%'
      GROUP BY m.name, p."name"
    ) AS combinedResult
    ORDER BY market_name, product_name;
  `;
  return results;
}
