const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection with URL:', url);

if (!url || !key || key.includes('your-supabase')) {
  console.log('❌ Supabase keys missing or set to placeholder.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  try {
    const { data, error } = await supabase.from('academic_sessions').select('*');
    if (error) {
      console.error('❌ Supabase Query Error:', error.message, error.details || '');
    } else {
      console.log('✅ Supabase Connection Successful! Sessions count:', data ? data.length : 0);
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Error testing connection:', err);
  }
}

test();
