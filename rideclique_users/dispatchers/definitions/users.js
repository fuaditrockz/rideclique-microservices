exports.users_definition = [
  {
    id: { column: "id", id: true },
    firstname: { column: "firstname" },
    lastname: { column: "lastname" },
    email: { column: "email" },
    username: { column: "username" },
    phonenumber: { column: "phone_number" },
    avatar: {
      avatar_url_show: { column: "avatar_url_show" },
      avatar_url_thumbnail: { column: "avatar_url_thumbnail" }
    },
    birthdate: { column: 'bod' },
    language: { column: 'language' },
    place: { 
      country: 'country_id',
      region: 'region_id',
      city: 'city_id'
    },
    gender: { column: 'gender' },
    status: {
      is_verification: { column: 'is_verification' },
      is_active: { column: 'is_active' },
      is_online: { column: 'is_online' },
      is_premium: { column: 'is_blocked' }
    },
    account: {
      instagram: { column: 'instagram' },
      facebook: { column: 'facebook' },
      google: { column: 'google' }
    },
    created_at: { column: 'created_at' }
  }
]