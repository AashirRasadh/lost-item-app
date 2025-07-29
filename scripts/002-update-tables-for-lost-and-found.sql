-- Add item_type column to lost_items table
ALTER TABLE lost_items ADD COLUMN item_type TEXT NOT NULL DEFAULT 'lost';

-- Add constraint to ensure item_type is either 'lost' or 'found'
ALTER TABLE lost_items ADD CONSTRAINT check_item_type CHECK (item_type IN ('lost', 'found'));

-- Rename the table to be more generic
ALTER TABLE lost_items RENAME TO items;

-- Update the foreign key references in comments table
ALTER TABLE comments DROP CONSTRAINT comments_post_id_fkey;
ALTER TABLE comments ADD CONSTRAINT comments_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES items(id) ON DELETE CASCADE;

-- Add category column for better organization
ALTER TABLE items ADD COLUMN category TEXT;

-- Add status column to track if item has been reunited
ALTER TABLE items ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE items ADD CONSTRAINT check_status CHECK (status IN ('active', 'resolved', 'closed'));

-- Update RLS policies for the renamed table
DROP POLICY "Anyone can view lost items" ON items;
DROP POLICY "Users can insert own lost items" ON items;
DROP POLICY "Users can update own lost items" ON items;
DROP POLICY "Users can delete own lost items" ON items;

CREATE POLICY "Anyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Users can insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own items" ON items FOR DELETE USING (auth.uid() = author_id);
