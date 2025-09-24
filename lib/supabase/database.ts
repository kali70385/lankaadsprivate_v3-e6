import { createClient } from "./server"

export interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  currency: string
  category_id: string
  location_id: string
  user_id: string
  images: string[]
  contact_phone: string | null
  contact_email: string | null
  status: "active" | "sold" | "expired" | "draft"
  featured: boolean
  views: number
  created_at: string
  updated_at: string
  expires_at: string
  // Joined data
  category?: {
    name: string
    slug: string
  }
  location?: {
    name: string
    slug: string
  }
  profile?: {
    username: string
    telephone: string | null
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface Location {
  id: string
  name: string
  slug: string
  type: "province" | "district" | "city"
  parent_id: string | null
  created_at: string
}

export async function getAds(filters?: {
  category?: string
  location?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("ads")
    .select(`
      *,
      category:categories(name, slug),
      location:locations(name, slug),
      profile:profiles(username, telephone)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (filters?.category) {
    query = query.eq("categories.slug", filters.category)
  }

  if (filters?.location) {
    query = query.eq("locations.slug", filters.location)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching ads:", error)
    return []
  }

  return data as Ad[]
}

export async function getAdById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ads")
    .select(`
      *,
      category:categories(name, slug),
      location:locations(name, slug),
      profile:profiles(username, telephone)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching ad:", error)
    return null
  }

  // Increment view count
  await supabase
    .from("ads")
    .update({ views: data.views + 1 })
    .eq("id", id)

  return data as Ad
}

export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export async function getLocations() {
  const supabase = createClient()

  const { data, error } = await supabase.from("locations").select("*").order("name")

  if (error) {
    console.error("Error fetching locations:", error)
    return []
  }

  return data as Location[]
}

export async function getFeaturedAds(limit = 6) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ads")
    .select(`
      *,
      category:categories(name, slug),
      location:locations(name, slug),
      profile:profiles(username, telephone)
    `)
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured ads:", error)
    return []
  }

  return data as Ad[]
}

export async function getUserAds(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ads")
    .select(`
      *,
      category:categories(name, slug),
      location:locations(name, slug)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user ads:", error)
    return []
  }

  return data as Ad[]
}

export async function createAd(adData: {
  title: string
  description: string
  price?: number
  category_id: string
  location_id: string
  images?: string[]
  contact_phone?: string
  contact_email?: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be authenticated to create an ad")
  }

  const { data, error } = await supabase
    .from("ads")
    .insert({
      ...adData,
      user_id: user.id,
      currency: "LKR",
      status: "active",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating ad:", error)
    throw error
  }

  return data as Ad
}
