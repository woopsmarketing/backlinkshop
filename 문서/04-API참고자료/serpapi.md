Google SERP
Try API Playground
GET Version: 1.0 Credits: 5
GET /serp/google
Parameters
q
Required
query
string
Query

locale
Required
query
string
Language and Geo Location , List available below

device_type
Required
query
string
Device type list available below

page_count
Required
query
number
Pagination Count, Credit Usage will be (5 X Page Count)

Example Request
Copy

curl -X GET "https://vebapi.com/api/serp/google?q=laptop&locale=en-us&device_type=desktop_chrome&page_count=1" \
 -H "X-API-KEY: c7873582-e5c9-46ef-b783-f95af203f1af" \
 -H "Content-Type: application/json"
Response
Copy
{
"engine": "Vebapi v8",
"node": "master",
"provider": "vebapi.com",
"request": {
"target": "google_serp",
"query": "laptop",
"locale": "en-us",
"device_type": "desktop_chrome"
},
"results": {
"results": [
{
"content": {
"results": {
"last_visible_page": 10,
"page": 1,
"parse_status_code": 12000,
"results": {
"ai_overviews": [
{
"answer_text": [
{
"pos": 1,
"text": [
"Laptops (ou notebooks) s\u00e3o computadores port\u00e1teis projetados para uso pessoal, combinando mobilidade com a funcionalidade de um desktop. Eles possuem bateria, tela e teclado integrados, ideais para trabalho, estudos e jogos, com modelos populares da Dell, Lenovo, ASUS, HP, Acer e Apple.\u00a0Mercado Livre\u00a0+5"
]
},
{
"pos": 2,
"text": [
"Principais Caracter\u00edsticas e Tipos:"
]
}
],
"bullet_list": [
{
"list_title": "Principais Caracter\u00edsticas e Tipos:",
"points": [
"Portabilidade: Projetados para serem leves e usados em qualquer lugar.",
"Componentes: Telas geralmente de 11 a 16 polegadas, processadores Intel ou AMD, e armazenamento SSD.",
"Tipos:"
],
"pos": 1
},
{
"list_title": "Componentes: Telas geralmente de 11 a 16 polegadas, processadores Intel ou AMD, e armazenamento SSD.",
"points": null,
"pos": 2
}
],
"pos_overall": 3
}
],
"organic": [
{
"additional_info": [
"4,7\u00a0classifica\u00e7\u00e3o da loja\u00a0(2,1\u00a0mil)"
],
"desc": "Frete gr\u00e1tis no dia \u2713 Compre j\u00e1 Laptop parcelado sem juros! Saiba mais sobre nossas incr\u00edveis ofertas e promo\u00e7\u00f5es em milh\u00f5es de produtos.",
"favicon_text": "Mercado Livre",
"pos": 1,
"pos_overall": 4,
"rating": 4.7,
"title": "Laptop",
"url": "https://lista.mercadolivre.com.br/laptop",
"url_shown": "https://lista.mercadolivre.com.br\u203a ... \u203a Mini Laptop"
},
{
"additional_info": [
"3,6\u00a0classifica\u00e7\u00e3o da loja\u00a0(379)",
"Loja por perto\u00a0(3,2 km)",
"Frete gr\u00e1tis",
"Devolu\u00e7\u00e3o em at\u00e9 7 dia(s)"
],
"desc": "Laptop na Casas Bahia em at\u00e9 24x no site ou app. Compre Laptop no Carn\u00ea e Pix com descontos e frete gr\u00e1tis.",
"favicon_text": "Casas Bahia",
"pos": 2,
"pos_overall": 5,
"rating": 3.6,
"title": "Laptop",
"url": "https://www.casasbahia.com.br/laptop/b",
"url_shown": "https://www.casasbahia.com.br\u203a laptop"
},
{
"desc": "Compre os mais recentes notebooks e PCs 2 em 1 na Lenovo Brasil para escrit\u00f3rio, gaming, entretenimento, estudantes e uso di\u00e1rio.",
"favicon_text": "Lenovo",
"pos": 3,
"pos_overall": 6,
"title": "Notebooks 2 em 1, Gaming, Ultrafinos e Ofertas",
"url": "https://www.lenovo.com/br/pt/laptops/?srsltid=AfmBOoryiSvN7Md7L_tiyCIh-KIvuuXBcd15LfNjGUdgOvUdMh1b2rJ2",
"url_shown": "https://www.lenovo.com\u203a laptops"
},
{
"additional_info": [
"4,4\u00a0classifica\u00e7\u00e3o da loja\u00a0(2,6\u00a0mil)",
"Devolu\u00e7\u00e3o em at\u00e9 7 dia(s)"
],
"desc": "Gente, o laptop ou notebook \u00e9 um computador pr\u00e1tico e f\u00e1cil de usar, viu? Ele j\u00e1 vem com o pr\u00f3prio teclado, al\u00e9m de mouse, alto-falantes, microfone e c\u00e2mera\u00a0...",
"favicon_text": "Magazine Luiza",
"pos": 4,
"pos_overall": 7,
"rating": 4.4,
"title": "Laptop",
"url": "https://www.magazineluiza.com.br/busca/laptop/?srsltid=AfmBOor2q1Jc7-OkyadGBD-FmJGYvPVvOXIjm89T3UgJCQgrQSnLfWfc",
"url_shown": "https://www.magazineluiza.com.br\u203a busca \u203a laptop"
},
{
"additional_info": [
"3,9\u00a0classifica\u00e7\u00e3o da loja\u00a0(53)",
"Frete gr\u00e1tis"
],
"desc": "Confira os melhores notebooks e laptops 2 em 1 da Dell e aproveite ofertas exclusivas. \u00b7 Filtros \u00b7 Notebook Inspiron 15 \u00b7 Notebook Gamer Alienware 16 Aurora.",
"favicon_text": "Dell",
"pos": 5,
"pos_overall": 8,
"rating": 3.9,
"title": "Notebooks | Dell Brasil",
"url": "https://www.dell.com/pt-br/shop/notebooks-dell/scr/laptops",
"url_shown": "https://www.dell.com\u203a Brasil \u203a Notebooks"
},
{
"desc": "Notebooks s\u00e3o usados em muitos cen\u00e1rios, como no trabalho, na educa\u00e7\u00e3o, para jogar videogames, criar conte\u00fado, usar a internet, para multim\u00eddia pessoal ou para\u00a0...",
"favicon_text": "Wikipedia",
"pos": 6,
"pos_overall": 9,
"title": "Laptop \u2013 Wikip\u00e9dia, a enciclop\u00e9dia livre",
"url": "https://pt.wikipedia.org/wiki/Laptop",
"url_shown": "https://pt.wikipedia.org\u203a wiki \u203a Laptop"
},
{
"desc": "Encontre o computador Windows ideal para voc\u00ea com este teste da Microsoft. Escolha o melhor computador para compra com base no tamanho, desempenho,\u00a0...",
"favicon_text": "Microsoft",
"pos": 7,
"pos_overall": 10,
"title": "Ajude-me a escolher qual laptop ou PC Windows \u00e9 ideal ...",
"url": "https://www.microsoft.com/pt-br/windows/help-me-choose",
"url_shown": "https://www.microsoft.com\u203a windows \u203a help-me-choose"
},
{
"desc": "Compre online Notebooks. Encontre notebook dell e notebook inspiron com \u00f3timos pre\u00e7os. Frete GR\u00c1TIS com Prime.",
"favicon_text": "Amazon",
"pos": 8,
"pos_overall": 11,
"title": "Notebooks | Amazon.com.br",
"url": "https://www.amazon.com.br/b?ie=UTF8&node=16364755011",
"url_shown": "https://www.amazon.com.br\u203a ..."
},
{
"desc": "Um laptop \u00e9 um computador port\u00e1til que pode ser facilmente transportado.\u00c9 um dispositivo projetado para uso pessoal e pode executar v\u00e1rias fun\u00e7\u00f5es, como navegar\u00a0...",
"favicon_text": "Lenovo",
"pos": 9,
"pos_overall": 12,
"title": "Como um laptop \u00e9 diferente de um computador de mesa?",
"url": "https://www.lenovo.com/br/pt/glossary/what-is-laptop/?srsltid=AfmBOoqt7XvXtB1-bNqRGybIdr7BxlUTrcJIPT_D3twmgRK91nFl8NDZ",
"url_shown": "https://www.lenovo.com\u203a glossary \u203a what-is-laptop"
}
],
"organic_videos": [
{
"desc": "Por que chamamos, no Brasil, computadores port\u00e1teis de \"notebooks\", se em ingl\u00eas eles s\u00e3o chamados \"laptops\"? Conhe\u00e7a a hist\u00f3ria!",
"pos": 1,
"pos_overall": 13,
"title": "Por que chamamos laptop de notebook? - Mitos Ep. 26",
"url": "https://www.youtube.com/watch?v=d3XbcMT5kTE"
}
],
"paid": [],
"popular_products": [
{
"items": [
{
"currency": "USD",
"description": "Amazon.com.br - Retail\u00a0e mais",
"image_data": "",
"pos": 1,
"rating": "4,6",
"rating_count": 6,
"sellers": [
{
"installment_offer": {
"down_payment_price_str": "R$\u00a02.699,00 agora",
"monthly_price_str": "R$\u00a0224,91",
"number_of_months": 12
},
"pos": 1,
"seller_name": "Amazon.com.br - Retail"
}
],
"title": "Asus Vivobook Go 15 Notebook AMD Ryzen 5 7520U"
},
{
"currency": "USD",
"description": "Lenovo\u00a0e mais",
"image_data": "",
"pos": 2,
"rating": "4,6",
"rating_count": 755,
"sellers": [
{
"pos": 1,
"price_str": "R$\u00a03.150,99",
"seller_name": "Lenovo"
}
],
"title": "Notebook Lenovo Ideapad SSD"
},
{
"currency": "USD",
"description": "meupositivo.com.br\u00a0e mais",
"image_data": "",
"pos": 3,
"rating": "4,8",
"rating_count": 643,
"sellers": [
{
"pos": 1,
"price_str": "R$\u00a03.549,00",
"seller_name": "meupositivo.com.br"
}
],
"title": "Notebook Positivo Vision R15M AMD Ryzen 7-5825U Linux RAM 512GB SSD Wi-Fi 6 15\u201d Full HD IPS"
},
{
"currency": "USD",
"description": "HP Store Brasil\u00a0e mais",
"image_data": "",
"pos": 4,
"rating": "4,7",
"rating_count": 643,
"sellers": [
{
"pos": 1,
"price_str": "R$\u00a04.578,05",
"seller_name": "HP Store Brasil"
}
],
"title": "Notebook HP 256R G9 Intel Core 8GB 256GB 15,6 Windows"
},
{
"currency": "USD",
"description": "Havan\u00a0e mais",
"image_data": "",
"pos": 5,
"rating": "4,9",
"rating_count": 173,
"sellers": [
{
"installment_offer": {
"down_payment_price_str": "R$\u00a03.299,90 agora",
"monthly_price_str": "R$\u00a0329,99",
"number_of_months": 10
},
"pos": 1,
"seller_name": "Havan"
}
],
"title": "Notebook Lenovo IdeaPad 1i Intel Core"
},
{
"currency": "USD",
"description": "Gazin\u00a0e mais",
"image_data": "",
"pos": 6,
"rating": "4,9",
"rating_count": 259,
"sellers": [
{
"installment_offer": {
"down_payment_price_str": "R$\u00a01.369,90 agora",
"monthly_price_str": "R$\u00a0122,75",
"number_of_months": 12
},
"pos": 1,
"seller_name": "Gazin"
}
],
"title": "Notebook Ultra UB261 Celeron N4020C 128GB 4GB RAM"
}
],
"pos_overall": 1
}
],
"related_questions": {
"items": [
{
"ai_overview": {
"answer_text": [
{
"pos": 1,
"text": [
"N\u00e3o h\u00e1 diferen\u00e7a t\u00e9cnica significativa hoje em dia;",
"laptop (do ingl\u00eas \"colo e topo\") e notebook (caderno, em ingl\u00eas) s\u00e3o usados como sin\u00f4nimos para computadores port\u00e1teis, embora historicamente, \"laptops\" fossem maiores e mais potentes, e \"notebooks\" mais leves e b\u00e1sicos, uma distin\u00e7\u00e3o que desapareceu com a tecnologia.",
"A diferen\u00e7a de nome \u00e9 mais cultural: \"laptop\" \u00e9 mais comum em pa\u00edses de l\u00edngua inglesa, enquanto \"notebook\" virou o termo padr\u00e3o no Brasil, que \u00e9 o que os fabricantes usam.",
""
]
},
{
"pos": 2,
"text": [
"Em Resumo: Se voc\u00ea for comprar ou falar sobre um computador port\u00e1til hoje, pode usar os dois termos sem medo;",
"ambos se referem \u00e0 mesma categoria de aparelho, mas \"notebook\" \u00e9 o termo mais comum no Brasil para se referir a um laptop.",
""
]
}
],
"bullet_list": [
{
"list_title": "Contexto Hist\u00f3rico (Diferen\u00e7as Antigas)",
"points": [
"Laptop: Refere-se aos primeiros computadores port\u00e1teis, maiores, mais pesados e potentes, projetados para funcionar no colo, substituindo desktops.",
"Notebook: Surgiu para descrever modelos mais finos, leves e compactos, com desempenho b\u00e1sico, compar\u00e1veis a um \"caderno de anota\u00e7\u00f5es\" (da\u00ed o nome), sem drives de CD/DVD."
],
"pos": 1
},
{
"list_title": "Situa\u00e7\u00e3o Atual (Sem Diferen\u00e7a)",
"points": [
"Sin\u00f4nimos: Com o avan\u00e7o da tecnologia, os fabricantes conseguem colocar mais pot\u00eancia em aparelhos menores e mais leves, tornando os termos intercambi\u00e1veis.",
"Nomenclatura: \"Notebook\" \u00e9 a palavra mais popular no Brasil, enquanto \"laptop\" \u00e9 mais usada em outros lugares (EUA, por exemplo) para o mesmo aparelho.",
"Ultrabook: Um termo antigo da Intel para laptops premium, finos e potentes, hoje quase n\u00e3o usado como categoria distinta."
],
"pos": 2
}
],
"source_panel": {
"items": [
{
"description": "20 de jun. de 2023 \u2014 O pessoal come\u00e7ou a chamar desktop. porque era um dispositivo que voc\u00ea usava pra. pra trabalhar, lugar de trabal...",
"pos": 1,
"source": "TikTok\u00a0\u00b7",
"title": "Qual a diferen\u00e7a entre Notebook e Laptop? Muitas vezes, u... | TikTok",
"url": "https://www.tiktok.com/@alfredojuniorprof/video/7246894061154487558#:~:text=O%20pessoal%20come%C3%A7ou%20a%20chamar,existindo%20e%20trabalhando%20pra%20rede."
},
{
"description": "Qual \u00e9 a diferen\u00e7a entre notebook e laptop? Notebook consiste em um computador port\u00e1til leve e fino, que pode ser aberto como uma ...",
"pos": 2,
"source": "Tecnoblog",
"title": "Notebook ou laptop? Entenda a confus\u00e3o em torno da ... - Tecnoblog",
"url": "https://tecnoblog.net/responde/laptop-ou-notebook-entenda-a-confusao-em-torno-da-nomenclatura-do-portatil/#:~:text=notebook%20e%20tablet?-,Qual%20%C3%A9%20a%20diferen%C3%A7a%20entre%20notebook%20e%20laptop?,aos%20computadores%20port%C3%A1teis%20e%20compactos."
},
{
"description": "15 de out. de 2017 \u2014 fala galera bem-vindo ao canal que vai responder a sua pergunta: Que notebook comprar meu nome \u00e9 Michael Thomas ...",
"pos": 3,
"source": "YouTube\u00a0\u00b7",
"title": "Notebook ou Laptop, qual o correto? Entenda tamb\u00e9m sobre NetBook e ...",
"url": "https://www.youtube.com/watch?v=BlGjBPsoX-w"
},
{
"description": "13 de mai. de 2025 \u2014 assim ou sen\u00e3o por mais estranha que a hist\u00f3ria possa parecer \u00e9 verdade. a hist\u00f3ria n\u00e9 e no epis\u00f3dio de hoje a g...",
"pos": 4,
"source": "YouTube\u00a0\u00b7",
"title": "Por que chamamos laptop de notebook? - Mitos Ep. 26",
"url": "https://www.youtube.com/watch?v=d3XbcMT5kTE&t=26"
},
{
"description": "20 de dez. de 2024 \u2014 Hoje em dia Mesmo com todas as diferen\u00e7as t\u00e9cnicas, com o avan\u00e7o da tecnologia as diferen\u00e7as quase desapareceram...",
"pos": 5,
"source": "Menina Shoes",
"title": "Qual a diferen\u00e7a entre laptop e notebook? | Blog Menina Shoes",
"url": "https://www.meninashoes.com.br/blog/qual-a-diferenca-entre-laptop-e-notebook#:~:text=e%20grande%20mobilidade.-,Hoje%20em%20dia,ser%20encontrado%20laptops%20mais%20robustos."
},
{
"description": "5 de dez. de 2011 \u2014 Origem dos termos As teorias acerca das origens dos termos s\u00e3o variadas, mas \u00e9 poss\u00edvel encontrar ao menos uma co...",
"pos": 6,
"source": "TechTudo",
"title": "Qual a diferen\u00e7a entre laptop e notebook? - TechTudo",
"url": "https://www.techtudo.com.br/noticias/2011/12/qual-diferenca-entre-um-laptop-e-um-notebook.ghtml#:~:text=Origem%20dos%20termos,de%20drives%20%C3%B3ticos%20ou%20n%C3%A3o."
},
{
"description": "30 de jan. de 2024 \u2014 Um dado interessante: em pa\u00edses de l\u00edngua inglesa, \u201claptop\u201d \u00e9 o termo mais comum, enquanto em pa\u00edses de l\u00edngua p...",
"pos": 7,
"source": "TikTok",
"title": "Diferen\u00e7as entre Notebook, Laptop e Desktop Explicadas - TikTok",
"url": "https://www.tiktok.com/@alfredojuniorprof/video/7330000752435416325#:~:text=Um%20dado%20interessante:%20em%20pa%C3%ADses,em:%20Feedback%20e%20ajuda%20%2D%20TikTok"
},
{
"description": "Com tradu\u00e7\u00e3o \u2014 O que \u00e9 um laptop, notebook ou ultrabook? Um laptop \u00e9 um computador port\u00e1til com tela e teclado integrados. Voc\u00ea pode ...",
"pos": 8,
"source": "coolblue.nl",
"title": "Qual a diferen\u00e7a entre um notebook, um laptop e um ultrabook?",
"url": "https://translate.google.com/translate?u=https://www.coolblue.nl/en/advice/difference-laptop-notebook-ultrabook.html&hl=pt&sl=en&tl=pt&client=sge#:~:text=O%20que%20%C3%A9%20um%20laptop,ele%20possui%20o%20selo%20Evo."
},
{
"description": "Com tradu\u00e7\u00e3o \u2014 Possui ventoinhas e outros componentes do sistema, semelhantes aos de um computador desktop, ajustados para se adequar...",
"pos": 9,
"source": "diffen.com",
"title": "Laptop vs Notebook - Diferen\u00e7as e Compara\u00e7\u00e3o - Diffen",
"url": "https://translate.google.com/translate?u=https://www.diffen.com/difference/Laptop_vs_Notebook&hl=pt&sl=en&tl=pt&client=sge#:~:text=Possui%20ventoinhas%20e%20outros%20componentes,no%20entanto%2C%20ser%20conectado%20externamente.&text=Um%20laptop%20%C3%A9%20um%20computador,bibliotecas%2C%20escrit%C3%B3rios%20tempor%C3%A1rios%20e%20reuni%C3%B5es.&text=Os%20laptops%20geralmente%20s%C3%A3o%20associados,sensa%C3%A7%C3%A3o%20de%20notebook%20se%20perde.&text=Um%20laptop%20geralmente%20pesa%20entre,cm%20ou%20menos%20de%20espessura.&text=Normalmente%20entre%20512%20GB%20e%201%20TB%20ou%20mais."
}
]
}
},
"pos": 1,
"question": "Qual a diferen\u00e7a do notebook e do laptop?"
},
{
"ai_overview": {
"answer_text": [
{
"pos": 1,
"text": [
"Um laptop \u00e9 um computador pessoal port\u00e1til, projetado para ser usado em qualquer lugar, que integra tela, teclado e bateria, similar a um \"caderno\" (notebook), mas o termo \"laptop\" deriva do ingl\u00eas para \"no colo\" (lap), e hoje, apesar das pequenas nuances hist\u00f3ricas (laptops eram maiores, notebooks menores), laptop e notebook s\u00e3o usados como sin\u00f4nimos para o mesmo dispositivo.",
"Eles oferecem funcionalidade de desktop com a vantagem da mobilidade, permitindo navegar na internet, criar documentos, jogar, etc."
]
},
{
"pos": 2,
"text": [
"Em resumo, quando voc\u00ea v\u00ea um \"notebook\" \u00e0 venda hoje, est\u00e1 vendo um laptop, e vice-versa."
]
}
],
"bullet_list": [
{
"list_title": "Principais caracter\u00edsticas:",
"points": [
"Portabilidade: Leve e compacto, com bateria recarreg\u00e1vel, permitindo o uso longe de tomadas.",
"Tudo em um: Tela, teclado, touchpad (ou trackpoint) e componentes internos (processador, mem\u00f3ria, armazenamento) em uma \u00fanica unidade dobr\u00e1vel.",
"Funcionalidade: Realiza as mesmas tarefas que um computador de mesa (desktop).",
"Nome: \"Laptop\" (em cima do colo) vs. \"Notebook\" (caderno). No Brasil, \"notebook\" se popularizou, mas o termo correto em ingl\u00eas \u00e9 \"laptop\"."
],
"pos": 1
},
{
"list_title": "Diferen\u00e7a (hist\u00f3rica/marketing):",
"points": [
"Originalmente, laptops eram maiores e mais pesados, enquanto notebooks eram menores e mais finos, como cadernos.",
"Hoje, essa distin\u00e7\u00e3o quase n\u00e3o existe; s\u00e3o usados para descrever o mesmo tipo de computador port\u00e1til."
],
"pos": 2
}
],
"source_panel": {
"items": [
{
"description": "O que \u00e9 um laptop? Um laptop \u00e9 um computador port\u00e1til que pode ser facilmente transportado. \u00c9 um dispositivo projetado para uso pe...",
"pos": 1,
"source": "Lenovo",
"title": "Como um laptop \u00e9 diferente de um computador de mesa? - Lenovo",
"url": "https://www.lenovo.com/br/pt/glossary/what-is-laptop/#:~:text=O%20que%20%C3%A9%20um%20laptop,e%20s%C3%A3o%20alimentados%20por%20bateria."
},
{
"description": "20 de jun. de 2023 \u2014 O pessoal come\u00e7ou a chamar desktop. porque era um dispositivo que voc\u00ea usava pra. pra trabalhar, lugar de trabal...",
"pos": 2,
"source": "TikTok\u00a0\u00b7",
"title": "Qual a diferen\u00e7a entre Notebook e Laptop? Muitas vezes, u... | TikTok",
"url": "https://www.tiktok.com/@alfredojuniorprof/video/7246894061154487558#:~:text=O%20pessoal%20come%C3%A7ou%20a%20chamar,existindo%20e%20trabalhando%20pra%20rede."
},
{
"description": "31 de out. de 2022 \u2014 O que significa laptop? Em ingl\u00eas, \"lap\" significa \"colo\", \"top\" significa \"topo\". Portanto, \u00e9 um computador que...",
"pos": 3,
"source": "Buscape",
"title": "O que \u00e9 laptop? Tem diferen\u00e7a para notebook? Saiba tudo - Buscape",
"url": "https://www.buscape.com.br/notebook/conteudo/o-que-e-laptop-qual-a-diferenca-para-notebook#:~:text=O%20que%20significa%20laptop?,ou%20seja%2C%20uma%20m%C3%A1quina%20port%C3%A1til."
},
{
"description": "Um laptop e um caderno s\u00e3o computadores que podem ser usados para tarefas di\u00e1rias, como navegar na Internet, escrever e -mails e a...",
"pos": 4,
"source": "Lenovo",
"title": "O que \u00e9 um laptop vs notebook? - Lenovo",
"url": "https://www.lenovo.com/br/pt/glossary/laptop-vs-notebook/#:~:text=Um%20laptop%20e%20um%20caderno,de%20aplicativos%20e%20digitar%20texto."
},
{
"description": "Com tradu\u00e7\u00e3o \u2014 O que \u00e9 um laptop? Um laptop \u00e9 um computador port\u00e1til projetado para oferecer funcionalidades semelhantes \u00e0s de um com...",
"pos": 5,
"source": "hp.com",
"title": "Notebook vs. Laptop: Qual a diferen\u00e7a? - HP",
"url": "https://translate.google.com/translate?u=https://www.hp.com/us-en/shop/tech-takes/laptop-vs-notebook&hl=pt&sl=en&tl=pt&client=sge#:~:text=O%20que%20%C3%A9%20um%20laptop,portas%20e%20op%C3%A7%C3%B5es%20de%20conectividade."
},
{
"description": "Qual \u00e9 a diferen\u00e7a entre notebook e laptop? Notebook consiste em um computador port\u00e1til leve e fino, que pode ser aberto como uma ...",
"pos": 6,
"source": "Tecnoblog",
"title": "Notebook ou laptop? Entenda a confus\u00e3o em torno da ... - Tecnoblog",
"url": "https://tecnoblog.net/responde/laptop-ou-notebook-entenda-a-confusao-em-torno-da-nomenclatura-do-portatil/#:~:text=notebook%20e%20tablet?-,Qual%20%C3%A9%20a%20diferen%C3%A7a%20entre%20notebook%20e%20laptop?,aos%20computadores%20port%C3%A1teis%20e%20compactos."
},
{
"description": "O que \u00e9 um laptop vs um PC de desktop? Um laptop \u00e9 um computador port\u00e1til que voc\u00ea pode usar em qualquer lugar, enquanto um comput...",
"pos": 7,
"source": "Lenovo",
"title": "Quais s\u00e3o as vantagens de usar um PC de mesa? | Lenovo Brasil",
"url": "https://www.lenovo.com/br/pt/glossary/laptop-vs-desktop-pc/#:~:text=O%20que%20%C3%A9%20um%20laptop,em%20uma%20mesa%20ou%20mesa."
},
{
"description": "30 de jan. de 2024 \u2014 Um dado interessante: em pa\u00edses de l\u00edngua inglesa, \u201claptop\u201d \u00e9 o termo mais comum, enquanto em pa\u00edses de l\u00edngua p...",
"pos": 8,
"source": "TikTok",
"title": "Diferen\u00e7as entre Notebook, Laptop e Desktop Explicadas - TikTok",
"url": "https://www.tiktok.com/@alfredojuniorprof/video/7330000752435416325#:~:text=Um%20dado%20interessante:%20em%20pa%C3%ADses,em:%20Feedback%20e%20ajuda%20%2D%20TikTok"
},
{
"description": "15 de dez. de 2011 \u2014 Como surgiu o notebook Depois do surgimento dos Desktops, foi preciso uma m\u00e1quina que possu\u00edsse a fun\u00e7\u00e3o port\u00e1ti...",
"pos": 9,
"source": "bringIT",
"title": "Laptop e notebook: existe diferen\u00e7a entre os dois? - bringIT",
"url": "https://www.bringit.com.br/blog/dicas-e-tutoriais-para-notebook/laptop-e-notebook-diferencas/#:~:text=Como%20surgiu%20o%20notebook,como%20vai%20chamar%20o%20seu!"
},
{
"description": "27 de out. de 2024 \u2014 N\u00e3o \u00e9 exatamente um erro. ... O termo existe tamb\u00e9m em ingl\u00eas, mas caiu em desuso. Ambos nomes surgiram na d\u00e9cad...",
"pos": 10,
"source": "Superinteressante",
"title": "Por que, no Brasil, chamamos laptops de notebooks (\u201ccadernos\u201d em ...",
"url": "https://super.abril.com.br/coluna/oraculo/por-que-no-brasil-chamamos-laptops-de-notebooks-cadernos-em-ingles/#:~:text=N%C3%A3o%20%C3%A9%20exatamente%20um%20erro.&text=O%20termo%20existe%20tamb%C3%A9m%20em,pneus%20maci%C3%A7os%2C%20que%20n%C3%A3o%20furam?"
}
]
}
},
"pos": 2,
"question": "O que \u00e9 um laptop?"
},
{
"answer": "Laptop (AFI: /l\u00e6p\u02c8t\u0254p/), notebook (AFI: /no\u028at\u02c8b\u028ak/, do ingl\u00eas \"caderno\") ou computador port\u00e1til (abreviado frequentemente para port\u00e1til) \u00e9 um computador port\u00e1til, leve, projetado para ser transportado e utilizado em diferentes lugares com facilidade.",
"pos": 3,
"question": "O que \u00e9 laptop em ingl\u00eas?",
"source": {
"title": "Laptop \u2013 Wikip\u00e9dia, a enciclop\u00e9dia livre",
"url": "https://pt.wikipedia.org/wiki/Laptop#:~:text=Laptop%20(AFI%3A%20%2Fl%C3%A6p%CB%88t%C9%94p%2F,em%20diferentes%20lugares%20com%20facilidade.",
"url_shown": "Wikipedia"
}
},
{
"answer": "O que significa laptop? Em ingl\u00eas, \"lap\" significa \"colo\", \"top\" significa \"topo\". Portanto, \u00e9 um computador que pode ser usado sobre o colo, ou seja, uma m\u00e1quina port\u00e1til.31 de out. de 2022",
"pos": 4,
"question": "O que significa o nome laptop?",
"source": {
"title": "O que \u00e9 laptop? Tem diferen\u00e7a para notebook? Saiba tudo - Buscape",
"url": "https://www.buscape.com.br/notebook/conteudo/o-que-e-laptop-qual-a-diferenca-para-notebook#:~:text=O%20que%20significa%20laptop%3F,ou%20seja%2C%20uma%20m%C3%A1quina%20port%C3%A1til.",
"url_shown": "Buscape"
}
}
],
"pos_overall": 2
},
"related_searches": [
{
"pos_overall": 14,
"related_searches": [
"Laptop infantil",
"Laptop e notebook diferen\u00e7a",
"Laptop tradu\u00e7\u00e3o",
"Laptop Apple",
"Laptop HP",
"Laptop Lenovo"
],
"related_searches_urls": [
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+infantil&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAhZEAE",
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+e+notebook+diferen%C3%A7a&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAhfEAE",
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+tradu%C3%A7%C3%A3o&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAheEAE",
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+Apple&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAhdEAE",
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+HP&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAhcEAE",
"https://www.google.com/search?sca_esv=517629e0db3c0ca4&q=Laptop+Lenovo&sa=X&ved=2ahUKEwj8zNXNmJiTAxWDB7kGHXtYJaYQ1QJ6BAhaEAE"
]
}
],
"search_information": {
"no_results_for_original_query_found": false,
"query": "laptop",
"showing_results_for": "laptop",
"time_taken_displayed": null,
"total_results_count": 1870000000
},
"total_results_count": 1870000000
},
"url": "https://www.google.com/search?q=laptop"
},
"errors": [],
"status_code": 12000,
"task_id": "7437524320433242113"
},
"headers": [],
"status_code": 200,
"task_id": "7437524320433242113",
"created_at": "2026-03-11 15:46:20",
"updated_at": "2026-03-11 15:46:24"
}
]
}
}
Google SERP API
Retrieve real-time Google search results programmatically with our fast and reliable Google SERP API.

Endpoint
GET https://vebapi.com/api/serp/google
Authentication
Include your API key in the request header:

X-API-KEY: YOUR_API_KEY
Request Parameters
Parameter Type Required Description Example
q string Yes The Google search query keyword or phrase. laptop
locale string No Locale for the Google search results. en-us
device_type string No Device type used for the search simulation. desktop_chrome
page_count integer No Number of result pages to retrieve. 1
Example Request
curl -X GET "https://vebapi.com/api/serp/google?q=laptop&locale=en-us&device_type=desktop_chrome&page_count=1" \
 -H "X-API-KEY: YOUR_API_KEY" \
 -H "Content-Type: application/json"
Example Response
{
"engine": "Vebapi v8",
"node": "master",
"provider": "vebapi.com",
"request": {
"target": "google_serp",
"query": "laptop",
"locale": "en-us",
"device_type": "desktop_chrome"
},
"results": {
"results": [
{
"content": {
"results": {
"last_visible_page": 10,
"page": 1,
"parse_status_code": 12000,
"results": {
"ai_overviews": [],
"organic": [],
"organic_videos": [],
"paid": [],
"popular_products": [],
"related_questions": {},
"related_searches": [],
"search_information": {
"no_results_for_original_query_found": false,
"query": "laptop",
"showing_results_for": "laptop",
"time_taken_displayed": null,
"total_results_count": 1870000000
},
"total_results_count": 1870000000
},
"url": "https://www.google.com/search?q=laptop"
},
"errors": [],
"status_code": 12000,
"task_id": "7437524320433242113"
},
"headers": [],
"status_code": 200,
"task_id": "7437524320433242113",
"created_at": "2026-03-11 15:46:20",
"updated_at": "2026-03-11 15:46:24"
}
]
}
}
Top-Level Response Fields
Field Type Description
engine string Version of the Vebapi engine handling the request.
node string Node name that processed the request.
provider string API provider name.
request object Echoed request metadata including target, query, locale, and device type.
results object Container for the returned SERP results.
Request Object
Field Type Description
target string Search target identifier.
query string The submitted search query.
locale string The locale used for result localization.
device_type string The device profile used for the request.
Result Structure
The API returns a nested structure inside results.results[].content.results.results. Depending on the query, the following blocks may be present:

ai_overviews - AI-generated overview blocks when available
organic - Standard organic search results
organic_videos - Video results from sources like YouTube
paid - Sponsored or paid search results
popular_products - Shopping/product listings
related_questions - People also ask style question blocks
related_searches - Related query suggestions
search_information - Summary information about the search
Organic Result Object
Field Type Description
title string Title of the organic result.
url string Destination URL.
url_shown string Displayed URL shown in search results.
desc string Description or snippet text.
favicon_text string Source or domain label.
pos integer Position within the organic block.
pos_overall integer Overall position on the results page.
rating number Rating value when available.
additional_info array Extra metadata such as ratings, shipping, or store information.
Search Information Object
Field Type Description
query string Original search query.
showing_results_for string The query Google is showing results for.
no_results_for_original_query_found boolean Whether no results were found for the original query.
time_taken_displayed string|null Displayed search time when available.
total_results_count integer Total estimated number of results returned by Google.
Status Codes
Field Description
status_code HTTP status for the API response.
parse_status_code Internal parsing status code for the SERP extraction job.

Device List
"device_types": [
"desktop",
"desktop_chrome",
"desktop_edge",
"desktop_firefox",
"desktop_opera",
"desktop_safari",
"mobile",
"mobile_android",
"mobile_ios",
"tablet",
"tablet_android",
"tablet_ios"
]

Geo Location and Language List

Label Locale Code
Afghanistan - Pashto ps-AF
Afghanistan - Persian fa-AF
Albania - Albanian sq-AL
Albania - English en-AL
Algeria - Arabic ar-DZ
Algeria - French fr-DZ
American Samoa - English en-AS
Andorra - Catalan ca-AD
Angola - Kikongo kg-AO
Angola - Portuguese pt-AO
Anguilla - English en-AI
Antigua and Barbuda - English en-AG
Argentina - Latin American Spanish es-419
Argentina - Spanish es-AR
Armenia - Armenian hy-AM
Armenia - Russian ru-AM
Australia - English en-AU
Austria - German de-AT
Azerbaijan - Azerbaijani az-AZ
Azerbaijan - Russian ru-AZ
Bahamas - English en-BS
Bahrain - Arabic ar-BH
Bahrain - English en-BH
Bangladesh - Bengali bn-BD
Bangladesh - English en-BD
Belarus - Belarusian be-BY
Belarus - English en-BY
Belarus - Russian ru-BY
Belgium - Dutch nl-BE
Belgium - English en-BE
Belgium - French fr-BE
Belgium - German de-BE
Belize - English en-BZ
Belize - Latin American Spanish es-419
Belize - Spanish es-BZ
Benin - French fr-BJ
Benin - Yoruba yo-BJ
Bhutan - English en-BT
Bolivia - Latin American Spanish es-419
Bolivia - Quechua qu-BO
Bolivia - Spanish es-BO
Bosnia and Herzegovina - Bosnian bs-BA
Bosnia and Herzegovina - Croatian hr-BA
Bosnia and Herzegovina - Serbian sr-BA
Botswana - English en-BW
Botswana - Tswana tn-BW
Brazil - Portuguese pt-BR
British Virgin Islands - English en-VG
Brunei - Chinese zh-BN
Brunei - English en-BN
Brunei - Malay ms-BN
Bulgaria - Bulgarian bg-BG
Burkina Faso - French fr-BF
Burundi - French fr-BI
Burundi - Kirundi rn-BI
Burundi - Swahili sw-BI
Cambodia - English en-KH
Cambodia - Kmher km-KH
Cameroon - English en-CM
Cameroon - French fr-CM
Canada - English en-CA
Canada - French fr-CA
Canada - Latin American Spanish es-419
Cape Verde - Portuguese pt-CV
Central African Republic - French fr-CF
Chad - Arabic ar-TD
Chad - French fr-TD
Chile - Latin American Spanish es-419
Chile - Spanish es-CL
China - Chinese (Simplified) zh-CN
Colombia - Latin American Spanish es-419
Colombia - Spanish es-CO
Cook Islands - English en-CK
Costa Rica - English en-CR
Costa Rica - Latin American Spanish es-419
Costa Rica - Spanish es-CR
Croatia - Croatian hr-HR
Cuba - Latin American Spanish es-419
Cuba - Spanish es-CU
Cyprus - English en-CY
Cyprus - Greek el-CY
Cyprus - Turkish tr-CY
Czech Republic - Czech cs-CZ
Denmark - Danish da-DK
Denmark - Faroese fo-DK
Djibouti - Arabic ar-DJ
Djibouti - French fr-DJ
Djibouti - Somali so-DJ
Dominica - English en-DM
Dominican Republic - Latin American Spanish es-419
Dominican Republic - Spanish es-DO
Ecuador - Latin American Spanish es-419
Ecuador - Spanish es-EC
Egypt - Arabic ar-EG
Egypt - English en-EG
El Salvador - Latin American Spanish es-419
El Salvador - Spanish es-SV
Estonia - Estonian et-EE
Estonia - Russian ru-EE
Ethiopia - Amharic am-ET
Ethiopia - English en-ET
Ethiopia - Somali so-ET
Fiji - English en-FJ
Finland - Finnish fi-FI
Finland - Swedish sv-FI
France - French fr-FR
Gabon - French fr-GA
Gambia - English en-GM
Gambia - Wolof wo-GM
Georgia - Kartuli ka-GE
Germany - German de-DE
Ghana - English en-GH
Gibraltar - English en-GI
Gibraltar - Italian it-GI
Gibraltar - Portuguese pt-GI
Gibraltar - Spanish es-GI
Greece - Greek el-GR
Greenland - Danish da-GL
Greenland - English en-GL
Guadeloupe - French fr-GP
Guatemala - Latin American Spanish es-419
Guatemala - Spanish es-GT
Guernsey - English en-GG
Guernsey - French fr-GG
Guyana - English en-GY
Haiti - English en-HT
Haiti - French fr-HT
Haiti - Haitian Creole ht-HT
Honduras - Latin American Spanish es-419
Honduras - Spanish es-HN
Hong Kong - Chinese (Simplified Han) zh-Hans
Hong Kong - Chinese (Traditional Han) zh-Hant
Hong Kong - English en-HK
Hungary - Hungarian hu-HU
Iceland - English en-IS
Iceland - Icelandic N/A
India - Bengali bn-IN
India - English en-IN
India - Gujarati gu-IN
India - Hindi hi-IN
India - Kannada kn-IN
India - Malayalam ml-IN
India - Marathi mr-IN
India - Punjabi pa-IN
India - Tamil ta-IN
India - Telugu te-IN
Indonesia - English en-ID
Indonesia - Indonesian id-ID
Indonesia - Javanese N/A
Iraq - Arabic ar-IQ
Iraq - English en-IQ
Ireland - English en-IE
Ireland - Irish ga-IE
Isle of Man - English en-IM
Israel - Arabic ar-IL
Israel - English en-IL
Israel - Hebrew he-IL
Italy - Italian it-IT
Ivory Coast - French fr-CI
Jamaica - English en-JM
Japan - Japanese ja-JP
Jersey - English en-JE
Jordan - Arabic ar-JO
Jordan - English en-JO
Kazakhstan - Kazakh kk-KZ
Kazakhstan - Russian ru-KZ
Kenya - English en-KE
Kenya - Swahili sw-KE
Kiribati - English en-KI
Korea - Korean ko-KR
Kurgyzstan - Kyrgyz ky-KG
Kurgyzstan - Russian ru-KG
Kuwait - Arabic ar-KW
Kuwait - English en-KW
Laos - English en-LA
Laos - Lao lo-LA
Latvia - Latvian lv-LV
Latvia - Lithuanian lt-LV
Latvia - Russian ru-LV
Lebanon - Arabic ar-LB
Lebanon - English en-LB
Lebanon - French fr-LB
Lesotho - English en-LS
Lesotho - Sesotho st-LS
Libya - Arabic ar-LY
Libya - English en-LY
Libya - Italian it-LY
Liechtenstein - German de-LI
Lithuania - Lithuanian lt-LT
Luxembourg - French fr-LU
Luxembourg - German de-LU
Macedonia - Macedonian mk-MK
Madagascar - French fr-MG
Madagascar - Malagasy mg-MG
Malawi - Chichewa ny-MW
Malawi - English en-MW
Malaysia - English en-MY
Malaysia - Malay ms-MY
Maldives - English en-MV
Mali - French fr-ML
Malta - English en-MT
Malta - Maltese mt-MT
Mauritius - English en-MU
Mauritius - French fr-MU
Mauritius - Mauritian Creole mfe-MU
Mexico - Latin American Spanish es-419
Mexico - Spanish es-MX
Moldova - Moldovan ro-MD
Moldova - Russian ru-MD
Mongolia - Mongolian mn-MN
Montenegro - Croatian hr-ME
Montenegro - Serbian sr-ME
Montserrat - English en-MS
Morocco - Arabic ar-MA
Morocco - French fr-MA
Mozambique - Portuguese pt-MZ
Myanmar - Burmese my-MM
Myanmar - English en-MM
Namibia - Afrikaans af-NA
Namibia - English en-NA
Namibia - German de-NA
Nauru - English en-NR
Nepal - English en-NP
Nepal - Nepali ne-NP
Netherlands - Dutch nl-NL
New Zealand - English en-NZ
New Zealand - Maori mi-NZ
Nicaragua - English en-NI
Nicaragua - Latin American Spanish es-419
Nicaragua - Spanish es-NI
Niger - French fr-NE
Niger - Hausa ha-NE
Nigeria - English en-NG
Nigeria - Hausa ha-NG
Nigeria - Igbo ig-NG
Nigeria - Yoruba yo-NG
Norway - Norwegian no-NO
Oman - Arabic ar-OM
Oman - English en-OM
Pakistan - English en-PK
Pakistan - Urdu ur-PK
Panama - English en-PA
Panama - Latin American Spanish es-419
Panama - Spanish es-PA
Paraguay - Latin American Spanish es-419
Paraguay - Spanish es-PY
Peru - Latin American Spanish es-419
Peru - Spanish es-PE
Philippines - English en-PH
Philippines - Filipino fil-PH
Poland - Polish pl-PL
Portugal - Portuguese pt-PT
Puerto Rico - English en-PR
Puerto Rico - Latin American Spanish es-419
Puerto Rico - Spanish es-PR
Qatar - Arabic ar-QA
Qatar - English en-QA
Romania - German de-RO
Romania - Hungarian hu-RO
Romania - Romanian ro-RO
Russia - Russian ru-RU
Rwanda - English en-RW
Rwanda - French fr-RW
Rwanda - Kinyarwanda rw-RW
Rwanda - Swahili sw-RW
Saudi Arabia - Arabic ar-SA
Saudi Arabia - English en-SA
Senegal - French fr-SN
Serbia - Serbian sr-RS
Seychelles - English en-SC
Seychelles - French fr-SC
Seychelles - Seychellois Creole crs-SC
Singapore - Chinese zh-SG
Singapore - English en-SG
Singapore - Malay ms-SG
Singapore - Tamil ta-SG
Slovakia - Slovak sk-SK
Slovenia - Slovenian sl-SI
Somalia - Arabic ar-SO
Somalia - English en-SO
Somalia - Somali so-SO
South Africa - Afrikaans af-ZA
South Africa - English en-ZA
South Africa - IsiXhosa xh-ZA
South Africa - IsiZulu zu-ZA
South Africa - Nothern Sotho nso-ZA
South Africa - Sesotho st-ZA
South Africa - Setswana tn-ZA
Spain - Catalan ca-ES
Spain - Spanish es-ES
Sri Lanka - English en-LK
Sri Lanka - Sinhala si-LK
Sri Lanka - Tamil ta-LK
Suriname - Dutch nl-SR
Suriname - English en-SR
Sweden - Swedish sv-SE
Switzerland - English en-CH
Switzerland - French fr-CH
Switzerland - German de-CH
Switzerland - Italian it-CH
Switzerland - Rumantsch rm-CH
Taiwan - Chinese zh-TW
Tajikistan - Russian ru-TJ
Tajikistan - Tajik tg-TJ
Tanzania - English en-TZ
Tanzania - Swahili sw-TZ
Thailand - English en-TH
Thailand - Thai th-TH
Togo - French fr-TG
Tonga - English en-TO
Tonga - Tongan to-TO
Trinidad and Tobago - English en-TT
Trinidad and Tobago - French fr-TT
Trinidad and Tobago - Latin American Spanish es-419
Trinidad and Tobago - Spanish es-TT
Tunisia - Arabic ar-TN
Tunisia - English en-TN
Turkey - Turkish tr-TR
Turkmenistan - Russian ru-TM
Turkmenistan - Turkmen tk-TM
Uganda - English en-UG
Uganda - Kiswahili sw-UG
Ukraine - Russian ru-UA
Ukraine - Ukranian uk-UA
United Arab Emirates - Arabic ar-AE
United Arab Emirates - English en-AE
United Kingdom - English en-GB
United States - English en-US
United States - Korean ko-US
United States - Latin American Spanish es-419
United States - Simplified Chinese zh-CN
United States - Spanish es-US
United States - Traditional Chinese zh-TW
United States - Vietnamese vi-US
Uruguay - Latin American Spanish es-419
Uruguay - Spanish es-UY
Uzbekistan - Russian ru-UZ
Uzbekistan - Uzbek uz-UZ
Venezuela - Latin American Spanish es-419
Venezuela - Spanish es-VE
Vietnam - English en-VN
Vietnam - French fr-VN
Vietnam - Vietnamese vi-VN
Zambia - English en-ZM
Zimbabwe - English en-ZW
Zimbabwe - Ndebele nd-ZW
Zimbabwe - Shona sn-ZW
Notes
The response may include different SERP blocks depending on the keyword, country, locale, and device type.
Some sections such as AI Overviews, product listings, or related questions may be empty or unavailable for certain searches.
Use page_count to retrieve more result pages when supported.
All results are returned in JSON format for easy parsing and integration.
