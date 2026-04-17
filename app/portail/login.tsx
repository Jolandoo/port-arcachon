import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Image,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { useUserStore } from '@/store/userStore'

export default function LoginScreen() {
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const setUser = useUserStore((s) => s.setUser)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez renseigner votre email et mot de passe.')
      return
    }
    setError(null)
    setLoading(true)

    // Simulation réseau 1 s + mock authentification
    await new Promise((r) => setTimeout(r, 900))

    // Mock : tout identifiant valide → connecté
    setUser({
      id:           'PLX-2024-00142',
      nom:          'Jean Dupont',
      email:        email.trim().toLowerCase(),
      role:         'plaisancier',
      anneauNumero: 'A-14',
    })
    setLoading(false)
    router.replace('/portail/dashboard')
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoSub}>Espace plaisancier</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email */}
          <Text style={styles.fieldLabel}>Identifiant / Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={Colors.gray500} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.gray300}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Mot de passe */}
          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.gray500} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray300}
              secureTextEntry={!showPwd}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPwd((v) => !v)} style={styles.eyeBtn}>
              <Ionicons
                name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.gray500}
              />
            </TouchableOpacity>
          </View>

          {/* Mot de passe oublié */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton connexion */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <>
                  <Ionicons name="log-in-outline" size={20} color={Colors.white} />
                  <Text style={styles.loginLabel}>Se connecter</Text>
                </>
            }
          </TouchableOpacity>
        </View>

        {/* Info aide */}
        <View style={styles.help}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.gray500} />
          <Text style={styles.helpText}>
            Vos identifiants vous ont été transmis par la capitainerie lors de votre inscription.
          </Text>
        </View>

        {/* Retour */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color={Colors.gray500} />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.gray50 },
  scroll: { flexGrow: 1, padding: Spacing.md, justifyContent: 'center' },

  // Header
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logo:    { width: 160, height: 120 },
  logoSub: { ...Typography.bodyMd, color: Colors.gray500, marginTop: Spacing.xs },

  // Formulaire
  form: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: Spacing.md,
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.danger + '12',
    borderRadius: 10, padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: { ...Typography.bodySm, color: Colors.danger, flex: 1 },

  fieldLabel: { ...Typography.bodySm, fontWeight: '600', color: Colors.gray500, marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.gray100,
    borderRadius: 12, backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.sm,
    height: 48,
  },
  inputIcon: { marginRight: Spacing.xs },
  input: { ...Typography.body, color: Colors.gray900, flex: 1 },
  eyeBtn: { padding: Spacing.xs },

  forgotBtn: { alignSelf: 'flex-end', marginTop: Spacing.sm },
  forgotText: { ...Typography.bodySm, color: Colors.ocean, fontWeight: '600' },

  loginBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.ocean,
    borderRadius: 14, height: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginLabel: { ...Typography.body, color: Colors.white, fontWeight: '700' },

  // Aide
  help: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs,
    paddingHorizontal: Spacing.xs, marginBottom: Spacing.lg,
  },
  helpText: { ...Typography.bodySm, color: Colors.gray500, flex: 1, lineHeight: 18 },

  // Retour
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, justifyContent: 'center' },
  backText: { ...Typography.bodyMd, color: Colors.gray500 },
})
