-- Database Initialization Script
-- Wird beim ersten Start des PostgreSQL Containers ausgeführt

-- Beispiel deutsche Banken
INSERT INTO banks (name, bic, bank_code, country_code) VALUES
('Deutsche Bank AG', 'DEUTDEFFXXX', '10070000', 'DE'),
('Commerzbank AG', 'COBADEFFXXX', '37040044', 'DE'),
('DZ Bank AG', 'GENODEFFXXX', '50060400', 'DE'),
('Sparkasse KölnBonn', 'COLSDE33XXX', '37050299', 'DE'),
('Postbank', 'PBNKDEFFXXX', '10010010', 'DE'),
('ING-DiBa', 'INGDDEFFXXX', '50010517', 'DE'),
('Volksbank', 'GENODEF1KIL', '21062406', 'DE')
ON CONFLICT (bic) DO NOTHING;

-- Beispiel UK Banken
INSERT INTO banks (name, bic, bank_code, country_code) VALUES
('Barclays Bank', 'BARCGB22XXX', '202053', 'GB'),
('HSBC Bank', 'MIDLGB22XXX', '400530', 'GB'),
('Lloyds Bank', 'LOYDGB21XXX', '309634', 'GB'),
('NatWest Bank', 'NWBKGB2LXXX', '601613', 'GB'),
('Santander UK', 'ABBYGB2LXXX', '090128', 'GB')
ON CONFLICT (bic) DO NOTHING;

-- Beispiel französische Banken
INSERT INTO banks (name, bic, bank_code, country_code) VALUES
('BNP Paribas', 'BNPAFRPPXXX', '20041', 'FR'),
('Crédit Agricole', 'AGRIFRPPXXX', '12006', 'FR'),
('Société Générale', 'SOGEFRPPXXX', '30003', 'FR'),
('Crédit Lyonnais', 'LYODFR2AXXX', '30002', 'FR')
ON CONFLICT (bic) DO NOTHING;

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_banks_country_code ON banks(country_code);
CREATE INDEX IF NOT EXISTS idx_banks_bank_code ON banks(bank_code);
CREATE INDEX IF NOT EXISTS idx_banks_bic ON banks(bic);