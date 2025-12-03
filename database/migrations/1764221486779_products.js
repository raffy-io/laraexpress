export async function up(db) {
  await db.none(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      product_image VARCHAR(255),
      product_name VARCHAR(255),
      product_price numeric(12,2),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function down(db) {
  await db.none(`DROP TABLE IF EXISTS products`);
}
