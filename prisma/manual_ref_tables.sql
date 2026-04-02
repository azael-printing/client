-- Create Customer table
CREATE TABLE IF NOT EXISTS "Customer" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Machine table
CREATE TABLE IF NOT EXISTS "Machine" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Item table
CREATE TABLE IF NOT EXISTS "Item" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "defaultUnit" TEXT NOT NULL DEFAULT 'pcs',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create PriceRule table
CREATE TABLE IF NOT EXISTS "PriceRule" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "machineId" TEXT NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "vatEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PriceRule_item_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "PriceRule_machine_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Unique rule per item+machine
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PriceRule_itemId_machineId_key'
  ) THEN
    ALTER TABLE "PriceRule"
      ADD CONSTRAINT "PriceRule_itemId_machineId_key" UNIQUE ("itemId","machineId");
  END IF;
END $$;