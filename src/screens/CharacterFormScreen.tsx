// src/screens/CharacterFormScreen.tsx

import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharactersStackParamList } from '../navigation/AppNavigator';
import { useCharactersStore } from '../stores/charactersStore';
import { colors, commonStyles, typography } from '../styles/common';
import { CharacterData, CharacterStats } from '../types';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharacterForm'>;

const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Other'];
const CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
const ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

const STAT_KEYS: (keyof CharacterStats)[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const STAT_LABELS: Record<keyof CharacterStats, string> = {
  strength: 'STR', dexterity: 'DEX', constitution: 'CON',
  intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA',
};

function modifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function FieldInput({ label, value, onChangeText, placeholder, keyboardType, multiline }: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: 'default' | 'number-pad' | 'decimal-pad'; multiline?: boolean;
}) {
  return (
    <View style={commonStyles.fieldWrap}>
      <Text style={commonStyles.fieldLabel}>{label}</Text>
      <TextInput
        style={[commonStyles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
      />
    </View>
  );
}

function Chips({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <View style={styles.chipRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onSelect(value === opt ? '' : opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function StatBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const mod = modifier(value);
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statModBubble}>
        <Text style={styles.statMod}>{mod}</Text>
      </View>
      <View style={styles.statInputRow}>
        <TouchableOpacity style={styles.statBtn} onPress={() => onChange(Math.max(1, value - 1))}>
          <Text style={styles.statBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.statInput}
          value={value.toString()}
          onChangeText={t => { const n = parseInt(t, 10); if (!isNaN(n) && n >= 1 && n <= 30) onChange(n); }}
          keyboardType="number-pad"
          textAlign="center"
          maxLength={2}
        />
        <TouchableOpacity style={styles.statBtn} onPress={() => onChange(Math.min(30, value + 1))}>
          <Text style={styles.statBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type Tab = 'identity' | 'stats' | 'lore';

const CharacterFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { characterId } = route.params ?? {};
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharactersStore();

  const existing = characters.find(c => c.id === characterId);
  const isEdit = !!existing;

  // Identity
  const [name, setName] = useState(existing?.name ?? '');
  const [race, setRace] = useState(existing?.race ?? '');
  const [charClass, setCharClass] = useState(existing?.class ?? '');
  const [background, setBackground] = useState(existing?.background ?? '');
  const [level, setLevel] = useState(existing?.level?.toString() ?? '1');
  const [alignment, setAlignment] = useState(existing?.data_json?.alignment ?? '');
  const [age, setAge] = useState(existing?.data_json?.age?.toString() ?? '');

  // Stats
  const [stats, setStats] = useState<CharacterStats>({
    strength: existing?.data_json?.stats?.strength ?? 10,
    dexterity: existing?.data_json?.stats?.dexterity ?? 10,
    constitution: existing?.data_json?.stats?.constitution ?? 10,
    intelligence: existing?.data_json?.stats?.intelligence ?? 10,
    wisdom: existing?.data_json?.stats?.wisdom ?? 10,
    charisma: existing?.data_json?.stats?.charisma ?? 10,
  });
  const [hpMax, setHpMax] = useState(existing?.data_json?.hp_max?.toString() ?? '');
  const [hpCurrent, setHpCurrent] = useState(existing?.data_json?.hp_current?.toString() ?? '');
  const [ac, setAc] = useState(existing?.data_json?.ac?.toString() ?? '');
  const [speed, setSpeed] = useState(existing?.data_json?.speed?.toString() ?? '30');
  const [gold, setGold] = useState(existing?.data_json?.gold?.toString() ?? '0');

  // Lore
  const [backstory, setBackstory] = useState(existing?.data_json?.backstory ?? '');
  const [traits, setTraits] = useState(existing?.data_json?.traits ?? '');
  const [ideals, setIdeals] = useState(existing?.data_json?.ideals ?? '');
  const [bonds, setBonds] = useState(existing?.data_json?.bonds ?? '');
  const [flaws, setFlaws] = useState(existing?.data_json?.flaws ?? '');
  const [notes, setNotes] = useState(existing?.data_json?.notes ?? '');
  const [equipment, setEquipment] = useState(existing?.data_json?.equipment ?? '');

  const [activeTab, setActiveTab] = useState<Tab>('identity');

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? existing?.name : 'New Hero' });
  }, [isEdit, existing?.name]);

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Name required', 'Give your hero a name.'); return; }

    const data_json: CharacterData = {
      stats,
      hp_max: hpMax ? parseInt(hpMax) : undefined,
      hp_current: hpCurrent ? parseInt(hpCurrent) : undefined,
      ac: ac ? parseInt(ac) : undefined,
      speed: speed ? parseInt(speed) : undefined,
      gold: gold ? parseInt(gold) : undefined,
      alignment: alignment || undefined,
      age: age ? parseInt(age) : undefined,
      backstory: backstory || undefined,
      traits: traits || undefined,
      ideals: ideals || undefined,
      bonds: bonds || undefined,
      flaws: flaws || undefined,
      notes: notes || undefined,
      equipment: equipment || undefined,
    };

    const payload = {
      name: name.trim(),
      race: race.trim() || undefined,
      class: charClass.trim() || undefined,
      background: background.trim() || undefined,
      level: Math.max(1, Math.min(20, parseInt(level) || 1)),
      data_json,
    };

    if (isEdit && existing) {
      await updateCharacter(existing.id, payload);
      Alert.alert('Saved', 'Character updated.');
    } else {
      const created = await createCharacter(payload);
      if (created) {
        Alert.alert('Hero forged', `${created.name} has entered the chronicles.`);
        navigation.goBack();
      }
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete hero', `Permanently delete "${existing.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCharacter(existing.id); navigation.goBack(); } },
    ]);
  }

  const profBonus = Math.ceil(1 + level ? (parseInt(level) - 1) / 4 + 1 : 2);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Tab bar */}
        <View style={styles.tabBar}>
          {(['identity', 'stats', 'lore'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Identity ── */}
          {activeTab === 'identity' && (
            <View>
              <FieldInput label="Character Name *" value={name} onChangeText={setName} placeholder="Aria Nightwhisper..." />

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Race</Text>
                <Chips options={RACES} value={race} onSelect={setRace} />
                {!RACES.includes(race) && race ? (
                  <TextInput style={[commonStyles.input, { marginTop: 6 }]} value={race} onChangeText={setRace} placeholder="Custom race..." placeholderTextColor={colors.muted} />
                ) : null}
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Class</Text>
                <Chips options={CLASSES} value={charClass} onSelect={setCharClass} />
              </View>

              <FieldInput label="Background" value={background} onChangeText={setBackground} placeholder="Sage, Acolyte, Criminal..." />

              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Level</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={level}
                    onChangeText={t => setLevel(t)}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholderTextColor={colors.muted}
                  />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Age</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    placeholder="—"
                    placeholderTextColor={colors.muted}
                  />
                </View>
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Alignment</Text>
                <Chips options={ALIGNMENTS} value={alignment} onSelect={setAlignment} />
              </View>
            </View>
          )}

          {/* ── Stats ── */}
          {activeTab === 'stats' && (
            <View>
              <Text style={[commonStyles.sectionTitle, { marginBottom: 12 }]}>Ability Scores</Text>
              <View style={styles.statsGrid}>
                {STAT_KEYS.map(key => (
                  <StatBox
                    key={key}
                    label={STAT_LABELS[key]}
                    value={stats[key]}
                    onChange={v => setStats(prev => ({ ...prev, [key]: v }))}
                  />
                ))}
              </View>

              <Text style={[commonStyles.sectionTitle, { marginTop: 16, marginBottom: 12 }]}>Combat</Text>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>HP Max</Text>
                  <TextInput style={commonStyles.input} value={hpMax} onChangeText={setHpMax} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>HP Current</Text>
                  <TextInput style={commonStyles.input} value={hpCurrent} onChangeText={setHpCurrent} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.muted} />
                </View>
              </View>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Armor Class</Text>
                  <TextInput style={commonStyles.input} value={ac} onChangeText={setAc} keyboardType="number-pad" placeholder="10" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Speed (ft)</Text>
                  <TextInput style={commonStyles.input} value={speed} onChangeText={setSpeed} keyboardType="number-pad" placeholder="30" placeholderTextColor={colors.muted} />
                </View>
              </View>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Gold (gp)</Text>
                  <TextInput style={commonStyles.input} value={gold} onChangeText={setGold} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>Prof. Bonus</Text>
                  <View style={[commonStyles.input, { justifyContent: 'center' }]}>
                    <Text style={{ color: colors.gold2, fontFamily: typography.title, fontSize: 15 }}>+{profBonus}</Text>
                  </View>
                </View>
              </View>

              <FieldInput label="Equipment" value={equipment} onChangeText={setEquipment} placeholder="Longsword, leather armor, rope..." multiline />
            </View>
          )}

          {/* ── Lore ── */}
          {activeTab === 'lore' && (
            <View>
              <FieldInput label="Backstory" value={backstory} onChangeText={setBackstory} placeholder="Born in the shadow of the great war..." multiline />
              <FieldInput label="Personality Traits" value={traits} onChangeText={setTraits} placeholder="Sarcastic but loyal..." multiline />
              <FieldInput label="Ideals" value={ideals} onChangeText={setIdeals} placeholder="Power should serve justice..." multiline />
              <FieldInput label="Bonds" value={bonds} onChangeText={setBonds} placeholder="I owe my life to the old blacksmith..." multiline />
              <FieldInput label="Flaws" value={flaws} onChangeText={setFlaws} placeholder="Can't resist a good treasure..." multiline />
              <FieldInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Session notes, reminders..." multiline />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={commonStyles.primaryCta} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#fce8e8" /> : (
                <Text style={commonStyles.primaryCtaText}>{isEdit ? 'Save Changes' : 'Forge this Hero'}</Text>
              )}
            </TouchableOpacity>
            {isEdit && (
              <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 8 }]} onPress={confirmDelete}>
                <Text style={commonStyles.dangerButtonText}>Delete Character</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CharacterFormScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  tabBar: { flexDirection: 'row', backgroundColor: colors.deep, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: colors.gold2 },
  tabText: { fontFamily: typography.title, fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  tabTextActive: { color: colors.gold2 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  rowFields: { flexDirection: 'row', gap: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: 6, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  chipText: { fontFamily: typography.body, fontSize: 12, color: colors.muted },
  chipTextActive: { color: colors.gold2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    width: '30%',
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: 10,
    flexGrow: 1,
  },
  statLabel: { fontFamily: typography.title, fontSize: 10, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statModBubble: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(201,152,58,0.1)',
    borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  statMod: { fontFamily: typography.title, fontSize: 14, color: colors.gold2, fontWeight: '700' },
  statInputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statBtn: {
    width: 24, height: 24, borderRadius: 6,
    backgroundColor: 'rgba(201,152,58,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  statBtnText: { color: colors.gold2, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  statInput: {
    width: 36, height: 30,
    borderRadius: 6, borderWidth: 1, borderColor: colors.border2,
    color: colors.parchment, fontFamily: typography.title, fontSize: 15, fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  actions: { marginTop: 24, gap: 8 },
});
