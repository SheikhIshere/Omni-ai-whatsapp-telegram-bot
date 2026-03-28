from google import genai
client = genai.Client(api_key="AIzaSyCBflhlPMoC9vYoJmxE0p6VfxMaC-rzwig")
response = client.models.generate_content(
    model="gemma-3-27b-it",
    contents="Explain quantum entanglement like I'm five.",
)
print(response.text)