// src/screens/CharacterFormScreen.tsx

import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharactersStackParamList } from '../navigation/AppNavigator';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore, CampaignRules } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { useChroniclesAlert } from '../components/AlertProvider';
import { colors, commonStyles, typography } from '../styles/common';
import { CharacterData, CharacterStats } from '../types';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharacterForm'>;

// ── Valeurs par défaut ────────────────────────────────────────────────────────

const DEFAULT_RACES = ['Humain', 'Elfe', 'Nain', 'Halfelin', 'Semi-Elfe', 'Tieflin', 'Dragonide', 'Gnome', 'Demi-Orc'];
const DEFAULT_CLASSES = ['Barbare', 'Barde', 'Clerc', 'Druide', 'Guerrier', 'Moine', 'Paladin', 'Rôdeur', 'Roublard', 'Ensorceleur', 'Sorcier', 'Magicien'];
const DEFAULT_BACKGROUNDS = ['Acolyte', 'Artisan', 'Charlatan', 'Criminel', 'Ermite', 'Étranger', 'Gladiateur', 'Marin', 'Noble', 'Paysan', 'Sage', 'Sauvageon', 'Soldat', 'Urfin'];
const DEFAULT_HAIR_COLORS = ['Noir', 'Brun', 'Châtain', 'Blond', 'Roux', 'Gris', 'Blanc', 'Bleu', 'Vert', 'Violet', 'Autre'];
const DEFAULT_EYE_COLORS = ['Marron', 'Noisette', 'Vert', 'Bleu', 'Gris', 'Violet', 'Or', 'Ambre', 'Autre'];
const DEFAULT_SKIN_TONES = ['Claire', 'Ivoire', 'Olivâtre', 'Mate', 'Foncée', 'Très foncée', 'Argentée', 'Dorée', 'Autre'];
const DEFAULT_PERSONALITY = ['Courageux', 'Prudent', 'Impulsif', 'Méfiant', 'Généreux', 'Sarcastique', 'Loyal', 'Chaotique', 'Ambitieux', 'Humble', 'Mystérieux', 'Jovial'];
const ALIGNMENTS_FR = ['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais'];

const STAT_KEYS: (keyof CharacterStats)[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const STAT_LABELS_FR: Record<keyof CharacterStats, string> = {
  strength: 'FOR', dexterity: 'DEX', constitution: 'CON',
  intelligence: 'INT', wisdom: 'SAG', charisma: 'CHA',
};

function modifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ── Composants ────────────────────────────────────────────────────────────────

function FieldInput({ label, value, onChangeText, placeholder, keyboardType, multiline }: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: 'default' | 'number-pad'; multiline?: boolean;
}) {
  return (
    <View style={commonStyles.fieldWrap}>
      <Text style={commonStyles.fieldLabel}>{label}</Text>
      <TextInput
        style={[commonStyles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
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

function Chips({ options, value, onSelect, multi }: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  multi?: boolean;
}) {
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
  const modColor = value > 10 ? '#70c090' : value < 10 ? '#e07070' : colors.parchment;
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statModBubble}>
        <Text style={[styles.statMod, { color: modColor }]}>{mod}</Text>
      </View>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.max(1, value - 1))} hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.statValue}>{value}</Text>
        <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.min(30, value + 1))} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type Tab = 'identity' | 'stats' | 'appearance' | 'lore';

// ── Écran principal ───────────────────────────────────────────────────────────

const CharacterFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { characterId, campaignId } = route.params ?? {};
  const { t } = useI18n();
  const { showAlert } = useChroniclesAlert();
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharactersStore();
  const { campaigns } = useCampaignsStore();

  const existing = characters.find(c => c.id === characterId);
  const isEdit = !!existing;

  // Règles de la campagne
  const campaign = campaigns.find(c => c.id === campaignId);
  const rules = (campaign?.rules_json ?? {}) as CampaignRules;
  const raceOptions = rules.allowed_races?.length ? rules.allowed_races : DEFAULT_RACES;
  const classOptions = rules.allowed_classes?.length ? rules.allowed_classes : DEFAULT_CLASSES;
  const backgroundOptions = rules.allowed_backgrounds?.length ? rules.allowed_backgrounds : DEFAULT_BACKGROUNDS;
  const hairOptions = rules.allowed_hair_colors?.length ? rules.allowed_hair_colors : DEFAULT_HAIR_COLORS;
  const eyeOptions = rules.allowed_eye_colors?.length ? rules.allowed_eye_colors : DEFAULT_EYE_COLORS;
  const skinOptions = rules.allowed_skin_tones?.length ? rules.allowed_skin_tones : DEFAULT_SKIN_TONES;
  const personalityOptions = rules.personality_presets?.length ? rules.personality_presets : DEFAULT_PERSONALITY;

  // ── État Identity ──
  const [name, setName] = useState(existing?.name ?? '');
  const [race, setRace] = useState(existing?.race ?? '');
  const [charClass, setCharClass] = useState(existing?.class ?? '');
  const [background, setBackground] = useState(existing?.background ?? '');
  const [level, setLevel] = useState(existing?.level?.toString() ?? '1');
  const [alignment, setAlignment] = useState(existing?.data_json?.alignment ?? '');
  const [age, setAge] = useState(existing?.data_json?.age?.toString() ?? '');

  // ── État Stats ──
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
  const [speed, setSpeed] = useState(existing?.data_json?.speed?.toString() ?? '9');
  const [gold, setGold] = useState(existing?.data_json?.gold?.toString() ?? '0');
  const [equipment, setEquipment] = useState(existing?.data_json?.equipment ?? '');

  // ── État Apparence ──
  const [height, setHeight] = useState(existing?.data_json?.height ?? '');
  const [weight, setWeight] = useState(existing?.data_json?.weight ?? '');
  const [eyes, setEyes] = useState(existing?.data_json?.eyes ?? '');
  const [hair, setHair] = useState(existing?.data_json?.hair ?? '');
  const [skin, setSkin] = useState(existing?.data_json?.skin ?? '');

  // ── État Lore ──
  const [backstory, setBackstory] = useState(existing?.data_json?.backstory ?? '');
  const [personalityPreset, setPersonalityPreset] = useState('');
  const [traits, setTraits] = useState(existing?.data_json?.traits ?? '');
  const [ideals, setIdeals] = useState(existing?.data_json?.ideals ?? '');
  const [bonds, setBonds] = useState(existing?.data_json?.bonds ?? '');
  const [flaws, setFlaws] = useState(existing?.data_json?.flaws ?? '');
  const [notes, setNotes] = useState(existing?.data_json?.notes ?? '');

  const [activeTab, setActiveTab] = useState<Tab>('identity');

  const lvlNum = Math.max(1, Math.min(20, parseInt(level) || 1));
  const profBonus = Math.ceil(lvlNum / 4) + 1;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? (existing?.name ?? t.characters.identity) : t.characters.forgeHero,
    });
  }, [isEdit, existing?.name]);

  async function handleSave() {
    if (!name.trim()) {
      showAlert({ icon: '⚠', title: t.common.nameRequired, message: t.characters.characterName, buttons: [{ text: 'OK' }] });
      return;
    }

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
      height: height || undefined,
      weight: weight || undefined,
      eyes: eyes || undefined,
      hair: hair || undefined,
      skin: skin || undefined,
    };

    const payload = {
      name: name.trim(),
      race: race.trim() || undefined,
      class: charClass.trim() || undefined,
      background: background.trim() || undefined,
      level: lvlNum,
      campaign_id: campaignId,
      data_json,
    };

    if (isEdit && existing) {
      await updateCharacter(existing.id, payload);
      showAlert({ icon: '✓', title: t.characters.saved, message: t.characters.characterUpdated, buttons: [{ text: 'OK' }] });
    } else {
      const created = await createCharacter(payload);
      if (created) {
        showAlert({
          icon: '⚔',
          title: t.characters.forgeHero,
          message: t.characters.heroForged(created.name),
          buttons: [{ text: 'OK', onPress: () => navigation.goBack() }],
        });
      }
    }
  }

  function confirmDelete() {
    if (!existing) return;
    showAlert({
      icon: '🗑',
      title: t.characters.deleteTitle,
      message: t.characters.deleteConfirm(existing.name),
      buttons: [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.common.delete, style: 'destructive', onPress: async () => { await deleteCharacter(existing.id); navigation.goBack(); } },
      ],
    });
  }

  // Présentation de la campagne (intro texte)
  const campaignIntro = rules.campaign_intro;
  const campaignBanner = campaign ? (
    <View style={styles.campaignBanner}>
      {campaignIntro ? (
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>📜 {campaign.name}</Text>
          <Text style={styles.introText}>{campaignIntro}</Text>
        </View>
      ) : (
        <Text style={styles.campaignBannerText}>
          {t.characters.campaignRules} · {campaign.name}
        </Text>
      )}
    </View>
  ) : null;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'identity', label: t.characters.identity },
    { key: 'stats', label: t.characters.stats },
    { key: 'appearance', label: t.characters.appearance },
    { key: 'lore', label: t.characters.lore },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {campaignBanner}

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Identité ── */}
          {activeTab === 'identity' && (
            <View>
              <FieldInput label={t.characters.characterName} value={name} onChangeText={setName} placeholder="Aria Nightwhisper..." />

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.race}</Text>
                <Chips options={raceOptions} value={race} onSelect={setRace} />
                {!raceOptions.includes(race) && race ? (
                  <TextInput
                    style={[commonStyles.input, { marginTop: 6 }]}
                    value={race} onChangeText={setRace}
                    placeholder={t.characters.customRace}
                    placeholderTextColor={colors.muted}
                  />
                ) : null}
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.class}</Text>
                <Chips options={classOptions} value={charClass} onSelect={setCharClass} />
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.background}</Text>
                <Chips options={backgroundOptions} value={background} onSelect={setBackground} />
                {!backgroundOptions.includes(background) && background ? (
                  <TextInput
                    style={[commonStyles.input, { marginTop: 6 }]}
                    value={background} onChangeText={setBackground}
                    placeholder="Historique personnalisé..."
                    placeholderTextColor={colors.muted}
                  />
                ) : null}
              </View>

              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.level}</Text>
                  <TextInput style={commonStyles.input} value={level} onChangeText={setLevel} keyboardType="number-pad" maxLength={2} placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.age}</Text>
                  <TextInput style={commonStyles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.muted} />
                </View>
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.alignment}</Text>
                <Chips options={ALIGNMENTS_FR} value={alignment} onSelect={setAlignment} />
              </View>
            </View>
          )}

          {/* ── Stats ── */}
          {activeTab === 'stats' && (
            <View>
              <Text style={[commonStyles.sectionTitle, { marginBottom: 12 }]}>{t.characters.abilityScores}</Text>
              <View style={styles.statsGrid}>
                {STAT_KEYS.map(key => (
                  <StatBox key={key} label={STAT_LABELS_FR[key]} value={stats[key]} onChange={v => setStats(prev => ({ ...prev, [key]: v }))} />
                ))}
              </View>

              <Text style={[commonStyles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>{t.characters.combat}</Text>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.hpMax}</Text>
                  <TextInput style={commonStyles.input} value={hpMax} onChangeText={setHpMax} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.hpCurrent}</Text>
                  <TextInput style={commonStyles.input} value={hpCurrent} onChangeText={setHpCurrent} keyboardType="number-pad" placeholder="—" placeholderTextColor={colors.muted} />
                </View>
              </View>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.armorClass}</Text>
                  <TextInput style={commonStyles.input} value={ac} onChangeText={setAc} keyboardType="number-pad" placeholder="10" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.speed}</Text>
                  <TextInput style={commonStyles.input} value={speed} onChangeText={setSpeed} keyboardType="number-pad" placeholder="9m" placeholderTextColor={colors.muted} />
                </View>
              </View>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.gold}</Text>
                  <TextInput style={commonStyles.input} value={gold} onChangeText={setGold} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.profBonus}</Text>
                  <View style={[commonStyles.input, { justifyContent: 'center' }]}>
                    <Text style={{ color: colors.gold2, fontFamily: typography.title, fontSize: 15 }}>+{profBonus}</Text>
                  </View>
                </View>
              </View>
              <FieldInput label={t.characters.equipment} value={equipment} onChangeText={setEquipment} placeholder="Épée longue, armure de cuir..." multiline />
            </View>
          )}

          {/* ── Apparence ── */}
          {activeTab === 'appearance' && (
            <View>
              <View style={styles.rowFields}>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.height}</Text>
                  <TextInput style={commonStyles.input} value={height} onChangeText={setHeight} placeholder="1m75..." placeholderTextColor={colors.muted} />
                </View>
                <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={commonStyles.fieldLabel}>{t.characters.weight}</Text>
                  <TextInput style={commonStyles.input} value={weight} onChangeText={setWeight} placeholder="70 kg..." placeholderTextColor={colors.muted} />
                </View>
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.hair}</Text>
                <Chips options={hairOptions} value={hair} onSelect={setHair} />
                {!hairOptions.includes(hair) && hair ? (
                  <TextInput style={[commonStyles.input, { marginTop: 6 }]} value={hair} onChangeText={setHair} placeholder="Couleur personnalisée..." placeholderTextColor={colors.muted} />
                ) : null}
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.eyes}</Text>
                <Chips options={eyeOptions} value={eyes} onSelect={setEyes} />
                {!eyeOptions.includes(eyes) && eyes ? (
                  <TextInput style={[commonStyles.input, { marginTop: 6 }]} value={eyes} onChangeText={setEyes} placeholder="Couleur personnalisée..." placeholderTextColor={colors.muted} />
                ) : null}
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.skin}</Text>
                <Chips options={skinOptions} value={skin} onSelect={setSkin} />
                {!skinOptions.includes(skin) && skin ? (
                  <TextInput style={[commonStyles.input, { marginTop: 6 }]} value={skin} onChangeText={setSkin} placeholder="Teinte personnalisée..." placeholderTextColor={colors.muted} />
                ) : null}
              </View>

              {/* Traits de personnalité prédéfinis */}
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.personalityPresets}</Text>
                <Text style={[commonStyles.mutedText, { marginBottom: 8 }]}>Sélectionnez un trait ou rédigez librement ci-dessous</Text>
                <View style={styles.chipRow}>
                  {personalityOptions.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.chip, personalityPreset === opt && styles.chipActive]}
                      onPress={() => {
                        if (personalityPreset === opt) {
                          setPersonalityPreset('');
                        } else {
                          setPersonalityPreset(opt);
                        }
                      }}
                    >
                      <Text style={[styles.chipText, personalityPreset === opt && styles.chipTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ── Histoire ── */}
          {activeTab === 'lore' && (
            <View>
              <FieldInput label={t.characters.backstory} value={backstory} onChangeText={setBackstory} placeholder="Né dans l'ombre de la grande guerre..." multiline />

              {/* Traits — avec préset sélectionné en suggestion */}
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.characters.traits}</Text>
                {personalityPreset ? (
                  <TouchableOpacity
                    style={styles.presetSuggestion}
                    onPress={() => { setTraits(traits ? `${traits}, ${personalityPreset}` : personalityPreset); }}
                  >
                    <Text style={styles.presetSuggestionText}>💡 Ajouter "{personalityPreset}" depuis l'apparence</Text>
                  </TouchableOpacity>
                ) : null}
                <TextInput
                  style={[commonStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                  value={traits} onChangeText={setTraits}
                  placeholder="Sarcastique mais loyal..."
                  placeholderTextColor={colors.muted}
                  multiline
                />
              </View>

              <FieldInput label={t.characters.ideals} value={ideals} onChangeText={setIdeals} placeholder="La justice avant tout..." multiline />
              <FieldInput label={t.characters.bonds} value={bonds} onChangeText={setBonds} placeholder="Je dois ma vie au vieux forgeron..." multiline />
              <FieldInput label={t.characters.flaws} value={flaws} onChangeText={setFlaws} placeholder="Ne peut résister aux trésors..." multiline />
              <FieldInput label={t.characters.notes} value={notes} onChangeText={setNotes} placeholder="Notes de session..." multiline />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={commonStyles.primaryCta} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#fce8e8" /> : (
                <Text style={commonStyles.primaryCtaText}>{isEdit ? t.characters.saveChanges : t.characters.forgeHero}</Text>
              )}
            </TouchableOpacity>
            {isEdit && (
              <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 8 }]} onPress={confirmDelete}>
                <Text style={commonStyles.dangerButtonText}>{t.characters.deleteCharacter}</Text>
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

  campaignBanner: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  campaignBannerText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(201,152,58,0.08)',
  },
  introBox: {
    backgroundColor: 'rgba(201,152,58,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  introTitle: {
    fontFamily: typography.title,
    fontSize: 13,
    color: colors.gold2,
    fontWeight: '700',
    marginBottom: 6,
  },
  introText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: colors.gold2 },
  tabText: { fontFamily: typography.title, fontSize: 9, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  tabTextActive: { color: colors.gold2 },

  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
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

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  statBox: {
    width: '30%', flexGrow: 1,
    backgroundColor: colors.deep, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6,
  },
  statLabel: { fontFamily: typography.title, fontSize: 10, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  statModBubble: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201,152,58,0.08)', borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  statMod: { fontFamily: typography.title, fontSize: 16, fontWeight: '700' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(201,152,58,0.12)', borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { color: colors.gold2, fontSize: 18, fontWeight: '700', lineHeight: 22 },
  statValue: { fontFamily: typography.title, fontSize: 17, fontWeight: '700', color: colors.parchment, minWidth: 28, textAlign: 'center' },

  presetSuggestion: {
    backgroundColor: 'rgba(201,152,58,0.08)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  presetSuggestionText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.gold,
    fontStyle: 'italic',
  },

  actions: { marginTop: 24, gap: 8 },
});
