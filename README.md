# CoffeeCounter
An ESPHome, Cloudflare Worker and Cloudflare Pages based coffee counter using a student card.

## Why?
This project has been created to keep track of the coffees that get consumed by students at the Thomas More University of Applied Sciences.

Every coffee costs 10 eurocents. By scanning your student card, it gets saved somewhere, so that you can later on review your balance and see how much coffee you have consumed.

## Components
There are several components to this project.

- Scanner  
  The scanner is the physical hardware that connects the real world to the cyberspace. In the real world, this is an ESP32 connected to a PN532 and a buzzer. It's programmed using the ESPHome suite of tools for ease of use.
- Worker  
  This is the Cloudflare Worker that provides the ESP32 with an API to save the coffees. It also functions as the API for increasing the balance on your tab.

## Author
Jonas Claes  
E-mail: [jonas@jonasclaes.be](mailto:jonas@jonasclaes.be)  
Website: https://jonasclaes.be  
