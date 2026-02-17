// test-supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('=== TEST CONNEXION SUPABASE ===');
console.log('URL:', supabaseUrl);
console.log('Key (premiers caractères):', supabaseAnonKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test de connexion
async function testConnection() {
  try {
    console.log('\n📡 Test de connexion...');
    
    // Récupère les game_systems (table publique)
    const { data, error } = await supabase
      .from('game_systems')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erreur:', error.message);
    } else {
      console.log('✅ Connexion réussie !');
      console.log('Données récupérées:', data);
    }
  } catch (err) {
    console.error('❌ Erreur fatale:', err);
  }
}

testConnection();
