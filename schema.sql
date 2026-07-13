-- Create Graves table (Handles dual graves natively)
CREATE TABLE IF NOT EXISTS graves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  qabr TEXT NOT NULL,
  cemeteryId TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  dod TEXT NOT NULL,
  family TEXT,
  dual_grave INTEGER DEFAULT 0, -- 1 if shared grave
  approved INTEGER DEFAULT 0, -- 0 = Pending, 1 = Approved
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  qty INTEGER NOT NULL,
  tree_qty INTEGER DEFAULT 0,
  gateway TEXT NOT NULL,
  target_details TEXT NOT NULL,
  total_price TEXT NOT NULL,
  debit_bank TEXT,
  debit_account TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pre-seed Lenasia Muslim Cemeteries
INSERT OR IGNORE INTO graves (id, name, surname, qabr, cemeteryId, lat, lng, dod, family, dual_grave, approved) 
VALUES ('QC-001', 'Abdul-Kadir', 'Ebrahim', 'G104', 'lenasia_avalon', -26.302314, 27.871214, '2023-04-12', 'Beloved father, grandfather & dedicated community teacher.', 0, 1);

INSERT OR IGNORE INTO graves (id, name, surname, qabr, cemeteryId, lat, lng, dod, family, dual_grave, approved) 
VALUES ('QC-002', 'Fatima', 'Hendricks', 'F205', 'lenasia_avalon', -26.302514, 27.871414, '2025-01-08', 'Mother of Lenasia southern suburbs soup kitchen network.', 0, 1);