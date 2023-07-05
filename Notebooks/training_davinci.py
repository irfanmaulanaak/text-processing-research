import openai
from openai import cli
import time
import shutil
import json

# Remember to remove your key from your code when you're done.
openai.api_key = "COPY_YOUR_OPENAI_KEY_HERE"
# Your resource endpoint should look like the following:
# https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_base =  "COPY_YOUR_OPENAI_ENDPOINT_HERE" 
openai.api_type = 'azure'
# The API version may change in the future.
openai.api_version = '2023-05-15'

training_file_name = 'output_prepared.jsonl'
validation_file_name = 'validation.jsonl'

# Copy the validation dataset file from the training dataset file.
# Typically, your training data and validation data should be mutually exclusive.
# For the purposes of this example, we're using the same data.
print(f'Copying the training file to the validation file')
shutil.copy(training_file_name, validation_file_name)

def check_status(training_id, validation_id):
    train_status = openai.File.retrieve(training_id)["status"]
    valid_status = openai.File.retrieve(validation_id)["status"]
    print(f'Status (training_file | validation_file): {train_status} | {valid_status}')
    return (train_status, valid_status)

# Upload the training and validation dataset files to Azure OpenAI.
training_id = cli.FineTune._get_or_upload(training_file_name, True)
validation_id = cli.FineTune._get_or_upload(validation_file_name, True)

# Check on the upload status of the training and validation dataset files.
(train_status, valid_status) = check_status(training_id, validation_id)

# Poll and display the upload status once a second until both files have either
# succeeded or failed to upload.
while train_status not in ["succeeded", "failed"] or valid_status not in ["succeeded", "failed"]:
    time.sleep(1)
    (train_status, valid_status) = check_status(training_id, validation_id)

# This example defines a fine-tune job that creates a customized model based on curie, 
# with just a single pass through the training data. The job also provides classification-
# specific metrics, using our validation data, at the end of that epoch.
create_args = {
    "training_file": training_id,
    "validation_file": validation_id,
    "model": "curie",
    "hyperparams": {
    "n_epochs": 1
    },
    "compute_classification_metrics": True,
    "classification_n_classes": 3
}
# Create the fine-tune job and retrieve the job ID
# and status from the response.
resp = openai.FineTune.create(**create_args)
job_id = resp["id"]
status = resp["status"]

# You can use the job ID to monitor the status of the fine-tune job.
# The fine-tune job may take some time to start and complete.
print(f'Fine-tuning model with job ID: {job_id}.')