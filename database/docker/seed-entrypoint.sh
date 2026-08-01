#!/bin/sh
# Runs once per database volume. The MySQL container has already applied
# schema/schema.sql via its /docker-entrypoint-initdb.d hook by the time this
# starts; here we only run the Node seeds that require bcrypt.
set -e

STATE_FILE=/state/.seeded

if [ -f "$STATE_FILE" ]; then
  echo "ℹ️  Database already seeded (found $STATE_FILE) - nothing to do."
  echo "   Remove the 'seed_state' volume to force a re-run."
  exit 0
fi

echo "🔐 Initialising default user passwords..."
node seeds/initialize_database.js

if [ "$SEED_SAMPLE_DATA" = "true" ]; then
  echo "🌱 Inserting comprehensive sample data (users, bookings, passengers)..."
  node seeds/insert_comprehensive_data.js

  echo "✈️  Adding extra flights..."
  node seeds/add_more_flights.js

  echo "💺 Populating seats, preferences and check-ins..."
  node seeds/populate_seats_preferences_checkins.js
else
  echo "ℹ️  SEED_SAMPLE_DATA is not 'true' - skipping optional sample data."
fi

touch "$STATE_FILE"
echo "✅ Database seeding complete."
