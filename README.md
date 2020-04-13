# Setup .env

	BUCKET
	AWS_ACCESS_KEY_ID
	AWS_SECRET_ACCESS_KEY

# Run it

	docker run --rm --env-file .env -p 3000:8080 hendry/webscreenshot
