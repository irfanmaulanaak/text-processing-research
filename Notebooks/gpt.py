import tiktoken
import openai

openai.api_type = "azure"
openai.api_version = "2023-05-15"
openai.api_base = "https://openai-cosmize-instance.openai.azure.com/"  # Your Azure OpenAI resource's endpoint value .
openai.api_key = "9b5a04e88ddc47498e134c1c992253c4"

system_message = {"role": "system", "content": "You are a helpful assistant."}
max_response_tokens = 250
token_limit = 4096
conversation = []
conversation.append(system_message)
conversation.append(
    {
        "role": "user",
        "content": "Fetch from this site https://cosmize.gitbook.io/cosmize/welcome-to-cosmize/whats-cosmize"
        +
        ", https://cosmize.gitbook.io/cosmize/welcome-to-cosmize/concept , https://cosmize.gitbook.io/cosmize/welcome-to-cosmize/architecture-and-technology"
        +
        ", https://cosmize.gitbook.io/cosmize/community/captains-program, https://medium.com/@cosmize_io/this-is-cosmize-here-is-great-to-know-about-us-6865a72889d"
        +
        ", https://medium.com/@cosmize_io/this-is-cosmize-here-is-great-to-know-about-us-6865a72889d, https://medium.com/@cosmize_io/ama-recap-cosmize-x-astar-network-e2f3317795c"
    }
)


def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
    encoding = tiktoken.encoding_for_model(model)
    num_tokens = 0
    for message in messages:
        num_tokens += (
            4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
        )
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":  # if there's a name, the role is omitted
                num_tokens += -1  # role is always required and always 1 token
    num_tokens += 2  # every reply is primed with <im_start>assistant
    return num_tokens


while True:
    user_input = input("")
    conversation.append({"role": "user", "content": user_input})
    conv_history_tokens = num_tokens_from_messages(conversation)

    while conv_history_tokens + max_response_tokens >= token_limit:
        del conversation[1]
        conv_history_tokens = num_tokens_from_messages(conversation)

    response = openai.ChatCompletion.create(
        engine="turbo",  # The deployment name you chose when you deployed the ChatGPT or GPT-4 model.
        messages=conversation,
        temperature=0.7,
        max_tokens=max_response_tokens,
    )

    conversation.append(
        {"role": "assistant", "content": response["choices"][0]["message"]["content"]}
    )
    print("\n" + response["choices"][0]["message"]["content"] + "\n")
