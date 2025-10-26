import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  nickname: string
  email: string
  avatar_url?: string
  bio?: string
  wallet_address?: string
  total_shards: number
  total_cards: number
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const authService = {
  /**
   * Получить текущего пользователя из Supabase
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const supabase = createClient()

      // Получаем текущую сессию
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        return null
      }

      // Получаем профиль из базы данных
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (error || !profile) {
        console.error("Error fetching profile:", error)
        return null
      }

      return {
        id: profile.id,
        nickname: profile.nickname,
        email: profile.email,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        wallet_address: profile.wallet_address,
        total_shards: profile.total_shards || 0,
        total_cards: profile.total_cards || 0,
        created_at: profile.created_at,
      }
    } catch (error) {
      console.error("Error in getCurrentUser:", error)
      return null
    }
  },

  /**
   * Регистрация нового пользователя
   * @deprecated Используйте компонент регистрации напрямую с Supabase
   */
  register: async (
    nickname: string,
    email: string,
    password: string
  ): Promise<User> => {
    const supabase = createClient()

    // Проверяем доступность nickname
    const { data: isAvailable } = await supabase.rpc("check_nickname_available", {
      p_nickname: nickname,
    })

    if (!isAvailable) {
      throw new Error(`Nickname "${nickname}" уже занят`)
    }

    // Регистрируем пользователя
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
      },
    })

    if (signUpError) throw signUpError
    if (!authData.user) throw new Error("Не удалось создать пользователя")

    // Проверяем что профиль создался
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      throw new Error("Ошибка создания профиля")
    }

    return {
      id: profile.id,
      nickname: profile.nickname,
      email: profile.email,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      wallet_address: profile.wallet_address,
      total_shards: profile.total_shards || 0,
      total_cards: profile.total_cards || 0,
      created_at: profile.created_at,
    }
  },

  /**
   * Вход в систему
   * @deprecated Используйте компонент входа напрямую с Supabase
   */
  login: async (identifier: string, password: string): Promise<User> => {
    const supabase = createClient()

    // identifier может быть email или nickname
    let email = identifier

    // Если identifier не содержит @, значит это nickname
    if (!identifier.includes("@")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("nickname", identifier)
        .single()

      if (!profile) {
        throw new Error("Пользователь не найден")
      }

      email = profile.email
    }

    // Входим через Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Неверный email/nickname или пароль")
      }
      throw error
    }

    if (!data.user) {
      throw new Error("Не удалось войти в систему")
    }

    // Получаем профиль
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error("Ошибка загрузки профиля")
    }

    return {
      id: profile.id,
      nickname: profile.nickname,
      email: profile.email,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      wallet_address: profile.wallet_address,
      total_shards: profile.total_shards || 0,
      total_cards: profile.total_cards || 0,
      created_at: profile.created_at,
    }
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    const supabase = createClient()
    await supabase.auth.signOut()
  },

  /**
   * Проверка авторизации
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return !!session
    } catch {
      return false
    }
  },

  /**
   * Обновление профиля
   */
  updateProfile: async (
    updates: Partial<Pick<User, "avatar_url" | "bio" | "wallet_address">>
  ): Promise<User> => {
    const supabase = createClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      throw new Error("Пользователь не авторизован")
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", authUser.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Ошибка обновления профиля: ${error.message}`)
    }

    return {
      id: profile.id,
      nickname: profile.nickname,
      email: profile.email,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      wallet_address: profile.wallet_address,
      total_shards: profile.total_shards || 0,
      total_cards: profile.total_cards || 0,
      created_at: profile.created_at,
    }
  },
}
