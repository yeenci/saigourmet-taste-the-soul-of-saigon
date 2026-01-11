/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Restaurant, Article } from "../lib/types";

export const MOCK_USERS: any[] = [
  {
    id: "admin-1",
    email: "admin@saigourmet.com",
    password: "password123",
    phone_number: "0901234567",
    address: "Saigon Centre, District 1",
    isAdmin: true,
  },
  {
    id: "user-1",
    email: "user@saigourmet.com",
    password: "password123",
    phone_number: "0909888777",
    address: "Thao Dien, District 2",
    isAdmin: false,
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    restaurantId: "r-1",
    name: "Cuc Gach Quan",
    address: "10 Dang Tat",
    district: "District 1",
    picture:
      "https://4.bp.blogspot.com/-JYTmH25WKb4/V4elej-LNdI/AAAAAAAACg8/AdW7kDFjk_MG4jduCCtjWO-EoiqEtbxawCLcB/s1600/cuc-gach-quan-10-dang-tat-2.jpg",
    rating: 4.8,
    openTime: "09:00",
    closeTime: "22:00",
    categories: ["Vietnamese", "Traditional", "Family"],
  },
  {
    restaurantId: "r-2",
    name: "Pizza 4P's Ben Thanh",
    address: "8 Thu Khoa Huan",
    district: "District 1",
    picture:
      "https://pizza4ps.com/wp-content/uploads/2023/07/Anh-man-hinh-2023-07-12-luc-16.28.22.png",
    rating: 4.9,
    openTime: "10:00",
    closeTime: "23:00",
    categories: ["Italian", "Pizza", "Family"],
  },
  {
    restaurantId: "r-3",
    name: "The Deck Saigon",
    address: "38 Nguyen U Di",
    district: "District 2",
    picture: "https://toplist.vn/images/800px/the-deck-saigon-1137530.jpg",
    rating: 4.7,
    openTime: "08:00",
    closeTime: "23:59",
    categories: ["River View", "Bar", "Fine Dining"],
  },
  {
    restaurantId: "r-4",
    name: "Anan Saigon",
    address: "89 Ton That Dam",
    district: "District 1",
    picture:
      "https://vietravelasia.com/media/images/2023/10/anna-saigon-restaurant-bdabae847882143092ff197d5473b76f.jpg",
    rating: 4.9,
    openTime: "17:00",
    closeTime: "23:00",
    categories: ["Fine Dining", "Vietnamese", "Experience"],
  },
  {
    restaurantId: "r-5",
    name: "Propaganda",
    address: "21 Han Thuyen",
    district: "District 1",
    picture:
      "https://cdn.almostlanding.com/wp-content/uploads/2017/04/propaganda-restaurant-saigon.jpg",
    rating: 4.5,
    openTime: "07:30",
    closeTime: "22:30",
    categories: ["Vietnamese", "Bistro", "Lunch"],
  },
  {
    restaurantId: "r-6",
    name: "Secret Garden",
    address: "158 Pasteur",
    district: "District 1",
    picture:
      "https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/secretgarden/nha-hang-secret-garden-restaurant-pasteur-khong-gian-1.jpg",
    rating: 4.6,
    openTime: "11:00",
    closeTime: "22:00",
    categories: ["Traditional", "Vietnamese", "Dinner"],
  },
  {
    restaurantId: "r-7",
    name: "Hum Vegetarian",
    address: "32 Vo Van Tan",
    district: "District 3",
    picture:
      "https://static.riviu.vn/image/2020/07/17/982cf9408bb745a681a62d5e4fa67435.jpg",
    rating: 4.8,
    openTime: "10:00",
    closeTime: "22:00",
    categories: ["Vegetarian", "Healthy", "Lunch"],
  },
  {
    restaurantId: "r-8",
    name: "Noir. Dining in the Dark",
    address: "180D Hai Ba Trung",
    district: "District 1",
    picture:
      "https://media.urbanistnetwork.com/saigoneer/article-images/2018/08/Aug3/Noir/Noir_SGRh.jpg",
    rating: 4.9,
    openTime: "17:30",
    closeTime: "23:00",
    categories: ["Experience", "Fine Dining"],
  },
  {
    restaurantId: "r-9",
    name: "Banh Mi Huynh Hoa",
    address: "26 Le Thi Rieng",
    district: "District 1",
    picture:
      "https://img.vietcetera.com/uploads/images/15-jan-2025/dsc00035-1-.jpeg",
    rating: 4.7,
    openTime: "14:00",
    closeTime: "23:00",
    categories: ["Street Food", "Vietnamese"],
  },
  {
    restaurantId: "r-10",
    name: "The Refinery",
    address: "74 Hai Ba Trung",
    district: "District 1",
    picture:
      "https://th.bing.com/th/id/R.0b2fa2c18a807cc85fdfd351617b3f95?rik=WShwUirXyCmoYg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-g8Hdw0gqhe0%2fUlgJW40nS9I%2fAAAAAAAAHtY%2f_U2m3SFFFVE%2fs1600%2fthe%2brefinery.JPG&ehk=keGUDHQAqbdGPIOoa3poxgrPCZVFN%2bZEf1iUzO7vMj8%3d&risl=&pid=ImgRaw&r=0",
    rating: 4.4,
    openTime: "11:00",
    closeTime: "23:00",
    categories: ["Bistro", "Bar", "Event"],
  },
  {
    restaurantId: "r-11",
    name: "L'Usine Le Thanh Ton",
    address: "19 Le Thanh Ton",
    district: "District 1",
    picture:
      "https://media-cdn.tripadvisor.com/media/photo-s/11/f4/f3/38/l-usine-le-thanh-ton.jpg",
    rating: 4.5,
    openTime: "08:00",
    closeTime: "21:00",
    categories: ["Cafe", "Brunch"],
  },
  {
    restaurantId: "r-12",
    name: "Dim Tu Tac",
    address: "29B Tran Hung Dao",
    district: "District 5",
    picture:
      "https://s3-ap-southeast-1.amazonaws.com/dimtutac/Media/smaller-2023-01-04T09_57_56.749Z-20230104095833-nxAsY.jpeg",
    rating: 4.6,
    openTime: "10:00",
    closeTime: "22:00",
    categories: ["Chinese", "Family", "Lunch"],
  },
  {
    restaurantId: "r-13",
    name: "Social Club Rooftop",
    address: "76 Nguyen Thi Minh Khai",
    district: "District 3",
    picture:
      "https://th.bing.com/th/id/R.beceb04c199e99509f082ab6fc581595?rik=V5hfoAZbmOt9QA&pid=ImgRaw&r=0",
    rating: 4.7,
    openTime: "17:00",
    closeTime: "02:00",
    categories: ["Bar", "Club", "River View"],
  },
  {
    restaurantId: "r-14",
    name: "Pasteur Street Brewing",
    address: "144 Pasteur",
    district: "District 1",
    picture:
      "https://www.petitfute.com/medias/professionnel/1632478/premium/originale/63ef8929004c5-pasteur-street-brewing.png",
    rating: 4.6,
    openTime: "11:00",
    closeTime: "23:30",
    categories: ["Bar", "Bistro"],
  },
  {
    restaurantId: "r-15",
    name: "Mekong Merchant",
    address: "23 Thao Dien",
    district: "District 2",
    picture:
      "https://static.muanhanh.com/images/2019/07/mekong-merchant/mekong-merchant-saigon-5.jpg",
    rating: 4.5,
    openTime: "07:00",
    closeTime: "22:00",
    categories: ["Brunch", "Cafe", "Family"],
  },
  {
    restaurantId: "r-16",
    name: "Sushi Rei",
    address: "10E1 Nguyen Thi Minh Khai",
    district: "District 1",
    picture:
      "https://nhaphonet.vn/wp-content/uploads/2023/04/sushi-tei-nguyen-thi-minh-khai-5.jpg",
    rating: 4.9,
    openTime: "17:30",
    closeTime: "22:30",
    categories: ["Japanese", "Fine Dining"],
  },
  {
    restaurantId: "r-17",
    name: "El Gaucho",
    address: "74 Hai Ba Trung",
    district: "District 1",
    picture:
      "https://global-uploads.webflow.com/60af8c708c6f35480d067652/62a6e600a7def7ca2544495c_screenshot_1655104991.png",
    rating: 4.8,
    openTime: "11:00",
    closeTime: "23:00",
    categories: ["Steakhouse", "Fine Dining", "Dinner"],
  },
  {
    restaurantId: "r-18",
    name: "Bun Cha 145",
    address: "145 Bui Vien",
    district: "District 1",
    picture:
      "https://th.bing.com/th/id/R.daf852a575d3fde21e869c535d953ea5?rik=1q6VhVd0PXqIxQ&riu=http%3a%2f%2fgucci-vietnam.com%2fwp-content%2fuploads%2f2015%2f12%2fo0775051613344268176.jpg&ehk=4zDqoyrnnUMfpS1bX1MJnlT%2fkfAiNqn3kVNk6lcQqbg%3d&risl=&pid=ImgRaw&r=0",
    rating: 4.4,
    openTime: "11:00",
    closeTime: "21:00",
    categories: ["Street Food", "Vietnamese"],
  },
  {
    restaurantId: "r-19",
    name: "Quan Bui",
    address: "19 Ngo Van Nam",
    district: "District 1",
    picture:
      "https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/quanbuingovannam/nha-hang-quan-bui-17A-ngo-van-nam-23.jpg",
    rating: 4.5,
    openTime: "08:00",
    closeTime: "23:00",
    categories: ["Vietnamese", "Family"],
  },
  {
    restaurantId: "r-20",
    name: "Blank Lounge Landmark",
    address: "Floor 75, Landmark 81",
    district: "Binh Thanh District",
    picture:
      "https://www.zonevietnam.com/uploads/gallery/blank-lounge-landmark-64c1c6377bc89.jpg",
    rating: 4.7,
    openTime: "09:30",
    closeTime: "00:00",
    categories: ["Bar", "Cafe", "Experience"],
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    articleId: "a-1",
    title: "10 Hidden Cafes in District 3",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    content:
      "District 3 is known for its tree-lined streets and colonial architecture. Hidden within its alleyways are some of the coziest cafes in Saigon...",
    date: "Jan 10, 2026",
    category: "Cafe Guide",
  },
  {
    articleId: "a-2",
    title: "The Ultimate Street Food Tour",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    content:
      "From Banh Mi to Com Tam, Saigon's street food scene is legendary. Join us as we explore the best stalls in District 4...",
    date: "Jan 08, 2026",
    category: "Street Food",
  },
  {
    articleId: "a-3",
    title: "Top 5 Rooftop Bars for Sunset",
    image:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80",
    content:
      "Nothing beats a sunset cocktail overlooking the Saigon River. Here are our top picks for the best views in town.",
    date: "Jan 05, 2026",
    category: "Nightlife",
  },
  {
    articleId: "a-4",
    title: "A Guide to Fine Dining in Saigon",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    content:
      "With Michelin stars finally arriving in Vietnam, the fine dining scene has exploded. We review the top tasting menus.",
    date: "Dec 28, 2025",
    category: "Fine Dining",
  },
  {
    articleId: "a-5",
    title: "Best Pho in Town: The Verdict",
    image:
      "https://media-gadventures.global.ssl.fastly.net/media-server/dynamic/blogs/posts/G-Adventures/2024/09/Vietnamese_Street_Food_-_Pho.webp",
    content:
      "Is it Pho Hoa, Pho Le, or a hidden gem? We tasted 20 different bowls to find the ultimate champion.",
    date: "Dec 20, 2025",
    category: "Traditional",
  },
  {
    articleId: "a-6",
    title: "Vegetarian Dining on the Rise",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    content:
      "Plant-based eating is taking over Saigon. Discover the restaurants proving that meat-free doesn't mean flavor-free.",
    date: "Dec 15, 2025",
    category: "Healthy",
  },
  {
    articleId: "a-7",
    title: "District 2: The Expat Foodie Hub",
    image:
      "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80",
    content:
      "Thao Dien offers a global culinary tour within a few square kilometers. From Italian to Mexican, we cover it all.",
    date: "Dec 10, 2025",
    category: "Guide",
  },
  {
    articleId: "a-8",
    title: "The Art of Vietnamese Coffee",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    content:
      "Ca Phe Sua Da is more than a drink; it's a culture. Learn about the beans, the brew, and the best spots to sip.",
    date: "Dec 05, 2025",
    category: "Culture",
  },
  {
    articleId: "a-9",
    title: "Date Night Ideas under 1 Million VND",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    content:
      "Romance doesn't have to break the bank. Check out these atmospheric spots perfect for couples.",
    date: "Nov 30, 2025",
    category: "Budget",
  },
  {
    articleId: "a-10",
    title: "Weekend Brunch Spots",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
    content:
      "Lazy Sundays call for eggs benedict and mimosas. Here's where to find the best brunch spreads.",
    date: "Nov 25, 2025",
    category: "Brunch",
  },
  {
    articleId: "a-11",
    title: "Exploring Cho Lon: Chinatown Eats",
    image: "https://i.ytimg.com/vi/3YtrvG9zgyg/hqdefault.jpg",
    content:
      "District 5 offers a distinct flavor profile with its rich Chinese heritage. Dumplings, duck, and noodles await.",
    date: "Nov 20, 2025",
    category: "Guide",
  },
  {
    articleId: "a-12",
    title: "New Openings: January 2026",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    content:
      "Stay ahead of the curve with our monthly round-up of the newest restaurant openings in HCMC.",
    date: "Nov 15, 2025",
    category: "News",
  },
];
