Backlink Lists
Try API Playground
GET Version: 1.0 Credits: 1
GET /seo/backlinkdata
Parameters
website
Required
query
string
enter your website url

X-API-KEY
Required
header
string
Your Vebapi Api key

Example Request
Copy

curl -X GET "https://vebapi.com/api/seo/backlinkdata?website=codeconia.com" \
-H "X-API-KEY: c7873582-e5c9-46ef-b783-f95af203f1af" \
-H "Content-Type: application/json"
Response
Copy
{
"counts": {
"backlinks": {
"total": 43,
"doFollow": 19,
"fromHomePage": 0,
"doFollowFromHomePage": 0,
"text": 32,
"toHomePage": 25
},
"domains": {
"total": 29,
"doFollow": 17,
"fromHomePage": 0,
"toHomePage": 21
},
"ips": null,
"cBlocks": null,
"anchors": null,
"anchorUrls": null,
"topTLD": null,
"topCountry": null,
"topAnchorsByBacklinks": null,
"topAnchorsByDomains": null,
"topAnchorUrlsByBacklinks": null,
"topAnchorUrlsByDomains": null
},
"backlinks": [
{
"url_from": "https://webrankdirectory.com/most-visited-site-47/",
"url_to": "https://codeconia.com/",
"title": "most visited site 47 |",
"anchor": "codeconia.com",
"alt": "",
"nofollow": true,
"image": false,
"image_source": "",
"inlink_rank": 15,
"domain_inlink_rank": 71,
"first_seen": "2024-05-18",
"last_visited": "2024-12-09"
},
{
"url_from": "https://lamercedpuno.edu.pe/best-white-dark-hat-linkbuilding-for-your-website-322/",
"url_to": "https://codeconia.com/",
"title": "BEST WHITE/DARK HAT LINKBUILDING FOR YOUR WEBSITE! NO PREPAYMENTS! 100% TRUSTWORTHY! \u2013 La Merced Puno",
"anchor": "LINKS FOR codeconia.com TELEGRAM @happygrannypies",
"alt": "",
"nofollow": false,
"image": false,
"image_source": "",
"inlink_rank": 0,
"domain_inlink_rank": 5,
"first_seen": "2024-08-29",
"last_visited": "2024-08-29"
},
{
"url_from": "https://www.tpsearchtool.com/images/79-mysql-join-3-tables-tutorial-table",
"url_to": "https://codeconia.com/wp-content/uploads/2022/10/HTML-CONTACT-FORM-TO-EMAIL.jpg",
"title": "How to join three tables in SQL query \u2013 MySQL Example - 79 Mysql Join 3 Tables Tutorial Table Images",
"anchor": "Join 3 Tables In Mysql In Single Query",
"alt": "",
"nofollow": true,
"image": true,
"image_source": "https://www.tpsearchtool.com/img/OIP.2oKrsZyx3Jg8DFZ3ciiyYQHaEK",
"inlink_rank": 0,
"domain_inlink_rank": 47,
"first_seen": "2025-01-05",
"last_visited": "2025-01-05"
},
{
"url_from": "https://www.sitelike.org/similar/codeconia.com/",
"url_to": "https://www.codeconia.com/",
"title": "codeconia Alternatives - 50 Best Sites Like codeconia.com in 2025",
"anchor": "codeconia.com",
"alt": "",
"nofollow": true,
"image": true,
"image_source": "https://www.sitelike.org/images/external-link.jpg",
"inlink_rank": 0,
"domain_inlink_rank": 75,
"first_seen": "2025-07-20",
"last_visited": "2025-07-20"
},
{
"url_from": "https://fashioment.com/02ea-5447/",
"url_to": "https://codeconia.com/",
"title": "02ea-5447 \u2013 fashioment",
"anchor": "Link",
"alt": "",
"nofollow": false,
"image": false,
"image_source": "",
"inlink_rank": 0,
"domain_inlink_rank": 60,
"first_seen": "2025-06-29",
"last_visited": "2025-07-06"
},
{
"url_from": "http://jasimalikhan.blogspot.com/2023/",
"url_to": "https://codeconia.com/how-to-backup-and-download-database-using-php/",
"title": "Web Development: 2023",
"anchor": "https://codeconia.com/how-to-backup-and-download-database-using-php/",
"alt": "",
"nofollow": false,
"image": false,
"image_source": "",
"inlink_rank": 0,
"domain_inlink_rank": 15,
"first_seen": "2025-06-01",
"last_visited": "2025-06-11"
},
{
"url_from": "https://kingladybeauty.com/best-white-dark-hat-linkbuilding-for-your-website-322/",
"url_to": "https://codeconia.com/",
"title": "BEST WHITE/DARK HAT LINKBUILDING FOR YOUR WEBSITE! NO PREPAYMENTS! 100% TRUSTWORTHY! | \u4eca\u82f1\u767e\u8ca8 / KING & LADY MATE Co., LTD.",
"anchor": "LINKS FOR codeconia.com TELEGRAM @happygrannypies",
"alt": "",
"nofollow": false,
"image": false,
"image_source": "",
"inlink_rank": 0,
"domain_inlink_rank": 17,
"first_seen": "2025-05-04",
"last_visited": "2025-05-04"
}
]
}
🔗 Backlink Lists API – VebAPI
Retrieve detailed backlink data for any domain, including link source, anchor text, link type (dofollow/nofollow), domain authority, and more.

📝 Description
The Backlink Lists API provides powerful insights into the backlink profile of a domain. It includes backlink sources, anchor texts, link types, domain and page authority metrics, and timestamps of when the links were first and last seen.

This API is ideal for SEO tools, backlink monitoring systems, and domain authority analysis dashboards.

🎯 Key Benefits
📈 Track how many backlinks and referring domains point to a website

🔍 Identify link types (dofollow/nofollow), homepage links, and anchor usage

🧠 Evaluate quality using inlink rank and domain authority scores

🧰 Useful for backlink audits, link building, and competitor research

🔔 Monitor changes with first-seen and last-visited timestamps

🌐 Base URL

https://vebapi.com/api/seo/backlinkdata

📥 Input Parameters
Parameter Type Required Description
website string ✅ Yes The domain name to analyze (e.g., codeconia.com)
Headers Required:

X-API-KEY: YOUR_API_KEY

Content-Type: application/json

📤 Output Response
The response contains two main parts: backlink summary stats (counts) and the list of actual backlinks (backlinks).

🔢 counts (Backlink Summary)

Field Type Description
backlinks.total int Total number of backlinks
backlinks.doFollow int Number of dofollow backlinks
backlinks.fromHomePage int Links originating from homepage
backlinks.toHomePage int Links pointing to homepage
domains.total int Number of unique referring domains
domains.doFollow int Referring domains with dofollow links
ips / cBlocks null Reserved for future IP-class breakdowns
anchors, anchorUrls null Reserved for anchor analytics (future use)
🔗 backlinks (Detailed List)

Each backlink object contains:

Field Type Description
url_from string The source URL where the backlink is located
url_to string The target URL being linked to
title string Title of the source page
anchor string Anchor text used in the backlink
nofollow boolean Indicates whether the link is nofollow
image boolean Whether the link is image-based
image_source string Source URL of the image, if any
inlink_rank int Page-level authority score (0–100)
domain_inlink_rank int Domain-level authority score (0–100)
first_seen string Date when the link was first detected
last_visited string Date when the link was last confirmed alive
