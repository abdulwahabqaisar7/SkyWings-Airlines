# SkyWings Airlines - One-shot database initialisation / seeding image.
# The schema itself is applied by the MySQL container's entrypoint; this image
# runs the Node seed scripts that need bcrypt (password hashes, sample data).
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY schema ./schema
COPY seeds ./seeds

COPY docker/seed-entrypoint.sh /usr/local/bin/seed-entrypoint.sh
# Strip CRLF in case the file was checked out with Windows line endings
RUN sed -i 's/\r$//' /usr/local/bin/seed-entrypoint.sh \
  && chmod +x /usr/local/bin/seed-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/seed-entrypoint.sh"]
