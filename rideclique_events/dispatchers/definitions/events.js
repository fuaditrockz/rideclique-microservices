exports.events_definition = [
  {
    id: { column: "id", id: true },
    name: { column: "name" },
    description: { column: "description" },
    event_date: { column: "event_date" },
    event_type: { column: "event_type" },
    event_owner: [
      { user: { column: "owner" } }
    ],
    event_participants: [
      { participant: { column: "participant" } }
    ],
    location: {
      venue: { column: "venue" },
      latitude: { column: "latitude" },
      longitude: { column: "longitude" },
      country: { column: "country_id" },
      region: { column: "region_id" },
      city: { column: "city_id" },
    },
    contact: {
      phone: { column: "contact_phone" },
      email: { column: "contact_email" }
    },
    picture: {
      url_thumbnail: { column: "photo_thumbnail_url" },
      url: { column: "photo_url" }
    },
    created_at: { column: "created_at" },
    updated_at: { column: "updated_at" }
  }
]
