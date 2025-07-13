-- Create a new table for user reports
CREATE TABLE IF NOT EXISTS user_reports (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  std_id VARCHAR(255),
  email VARCHAR(255),
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('uid', 'email')),
  report_message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_by VARCHAR(255),
  resolution_notes TEXT
);

-- Add comment to the table
COMMENT ON TABLE user_reports IS 'Stores user-reported issues with their student ID or email';

-- Add comments to columns
COMMENT ON COLUMN user_reports.id IS 'Primary key for the report';
COMMENT ON COLUMN user_reports.user_id IS 'Optional reference to the user ID if available (as string)';
COMMENT ON COLUMN user_reports.std_id IS 'The student ID associated with the report';
COMMENT ON COLUMN user_reports.email IS 'The email associated with the report';
COMMENT ON COLUMN user_reports.report_type IS 'Type of report (uid or email)';
COMMENT ON COLUMN user_reports.report_message IS 'User description of the issue';
COMMENT ON COLUMN user_reports.status IS 'Current status of the report';
COMMENT ON COLUMN user_reports.created_at IS 'Timestamp when the report was created';
COMMENT ON COLUMN user_reports.updated_at IS 'Timestamp when the report was last updated';
COMMENT ON COLUMN user_reports.resolved_by IS 'ID or name of the admin who resolved the report';
COMMENT ON COLUMN user_reports.resolution_notes IS 'Notes about how the issue was resolved';

-- Create an index on the status column for faster filtering
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);

-- Create an index on the student ID for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_reports_std_id ON user_reports(std_id);

-- Create an index on the email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_reports_email ON user_reports(email);

-- Automatically update the updated_at timestamp when a row is updated
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_reports_updated_at
BEFORE UPDATE ON user_reports
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
