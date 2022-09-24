# Scanner
This is the physical student card scanner.  

## Getting started
1. Setup a new Python 3 virtual environment
1. Install the `wheel` package using `pip install wheel`
1. Install the `esphome`, `tornado` and `esptool` packages using `pip install esphome tornado esptool`
1. Run the ESPHome dashboard using `esphome dashboard path/to/folder/of/rfid.yaml`
1. Open the dashboard in your web browser
1. Go to the secrets section and add the following section of code:
   ```yaml
   cloudflare_worker_api_key: abcd
   ```
   Make sure to replace `abcd` with your own API key set in the Cloudflare KV namespace.
1. Install the RFID scanner on the ESP32
1. Done!
