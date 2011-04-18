# Yokul -- Google Charts Done Locally #
This file last update: Apr 18th, 2011

Yokul is an experiment to see if a local, HTML5 Canvas based, implementation of the Google Charts API can be useful or advantageous. It's early in Yokul's development but I think the answer is already "yes".

## How It Works ##
Yokul reads the same query string you'd normally send to Google Charts. It then creates the same chart that Google would have, except does it locally on the client's machine using an HTML5 Canvas.

## Advantages ##
* **Easy to Learn:** If you already know the Google Chart API, then you know Yokul too.
* **Bandwidth:** A typical Google chart can be anywhere from 6k to 40k in size for just one chart. This chart image is also difficult to cache as charts are dynamic in nature. Yokul itself aims to be smaller than one chart, is very cachable, and once loaded can spit out countless charts on the client. Granted this bandwidth is between your user and Google and not your own servers, so you may not care.
* **Faster:** Early testing suggest loading a lot of charts (think sparklines) will be faster with Yokul than with Google Charts.
* **No GET or POST limitations:** Have a complex chart that requires you to send a POST to Google? With Yokul that's never an issue, Yokul will happily ingest query strings of virtually any length.
* **Better debugging experience:** Give yokul a place to dump debug/info/error info and it will happily do so. Makes it easier to see what's going on with your charts and is easier than debugging Google charts.
* **Fewer Limitations:** Google Charts has restrictions such as a chart at most can be 1000x1000 pixels. Yokul doesn't care about that. If you want a chart the size of New York, the only limiting factor is your user's machine.
* **Real time updates:** Internally Yokul is using an HTML5 canvas and draws the entire chart in a matter of milliseconds. Doing real time updates to data, animation, changing the chart type or size, etc will be very easy. This is one area that Yokul will really shine, once we get there :)
* **Privacy:** Yokul is open source, and completely runs on the client's machine. No sending data off to a third party.
* **Offline:** Yokul does not require an internet connection, it runs happily on a user's machine instead. Yokul can be used in offline apps, mobile apps, etc.

## Disadvantages ##
* **Added complexity:** Your app depends on yet another JavaScript library. Yokul is simple to set up but nowhere near as simple as just making a request to Google charts
* **Higher browser requirements:** Your user needs a modern browser to use Yokul. Google charts are just images as far as the browser is concerned
* **Compatibility:** Yokul, at least initially, is not looking to be 100% compatible with Google charts. For example, maps, QR codes, and dynamic labels are probably not going to be supported. See compatibility section below.
* **Not a trivial drop in replacement:** See the section below on why Yokul cannot be a truly drop in replacement for Google Charts. Your app will need to set up its chart images differently to use Yokul.
* **Not pixel perfect:** Pixel perfection is not one of Yokul's goals. If you need your charts to be 100% pixel for pixel the same as Google's, then Yokul may not be for you. Yokul for sure will provide a fully equivalent and equally featured chart, it just might make your title's a pixel bigger, or the labels might not quite be the same gray, etc etc.
* **Playing catch up:** If/when Google changes the chart API, Yokul will be forced to play catch up. If you need truly cutting edge Google charting, then it be better to stick with the real deal.

## Compatibility ##
As of this writing Yokul is very young and nowhere near ready for primetime. So far only bvg (bar vertical grouped) charts are supported, and only a subset of features at that. The overall goal is to support all "normal" chart types in their entirety: all bar, line, pie, scatter, etc type charts. Yokul has no intention of supporting QR codes, maps, radar charts, etc. However who knows, that may change in the future.

## Not a true drop in ##
When a browser encounters an image that has its src attribute specified, it immediately fires off a connection to go and grab that source. I know of no way to prevent this (if you do, please contact me). Therefore, you can't simply reference Yokul and have all your charts magically become local. Instead you must get rid of the src attribute, and provide the query string in another fashion (such as an HTML5 data attribute). Yes, this is a significant limitation, but not significant enough to stop Yokul in its tracks in my humble opinion.

## Roadmap ##
Here are my plans for Yokul development:  
  
* Get bvg (bar vertical group) charts 100% implemented. About, ohhhhh, 60% of the way there as of this writing.
* Extend support for all other bar chart types: grouped, stacked, overlapped, horizontal, vertical
* From there extend support for pie, line and scatter charts
* Once Yokul is mature enough, start offering true releases with minimized JavaScript
* Offer the ability to only pull in the pieces of Yokul you need to minimize the script even more (for example, leave out pie charts if you have no need for them)
* Demos, documentation, all that good stuff. Soon!

## License ##
Yokul is currently licensed under the BSD license. It's intended to be used anywhere: commercial or open source apps. If you don't like this license for whatever reason, feel free to contact me.
