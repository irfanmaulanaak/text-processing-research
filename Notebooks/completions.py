import openai
from openai import cli

openai.api_key = "9b5a04e88ddc47498e134c1c992253c4"
openai.api_base = "https://openai-cosmize-instance.openai.azure.com/"
openai.api_type = "azure"
# The API version may change in the future.
openai.api_version = "2023-05-15"

max_response_tokens = 250
token_limit = 4096

stringPrompts = [
    "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. The assistant name is Naufal. \nHuman: Hello, who are you?\nNaufal: I am an AI created by OpenAI. My name is Naufal. How can I help you today?\n "
]


def process_input(prompt):
    try:
        stringPrompts[0] = stringPrompts[0] + prompt + "\n"
        response = openai.Completion.create(
            engine="cosmize-text-davinci-003", prompt=stringPrompts, max_tokens=2000
        )
        stringPrompts[0] = stringPrompts[0] + response.choices[0].text + "\n"
        print(response.choices[0].text)
    except Exception as error:
        print(error)


def get_input():
    try:
        input_text = input("Human: ")
        if input_text.lower() == "exit":
            return
        process_input(input_text)
        get_input()
    except Exception as error:
        print(error)


def main():
    try:
        get_input()
    except Exception as error:
        print(error)


if __name__ == "__main__":
    main()
