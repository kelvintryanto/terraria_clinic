interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  color: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  joinDate: string;
  dogs: Dog[];
}

export const customers: Customer[] = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta, Indonesia",
    coordinates: {
      lat: -6.2088,
      lng: 106.8456,
    },
    joinDate: "2020-03-15",
    dogs: [
      {
        id: 1,
        name: "Max",
        breed: "Golden Retriever",
        age: 3,
        color: "Golden",
      },
      {
        id: 2,
        name: "Luna",
        breed: "Siberian Husky",
        age: 2,
        color: "Grey and White",
      },
    ],
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    phone: "081234567891",
    address: "Jl. Thamrin No. 45, Bandung, Indonesia",
    coordinates: { lat: -6.9147, lng: 107.6098 },
    joinDate: "2019-07-22",
    dogs: [{ id: 3, name: "Rocky", breed: "German Shepherd", age: 4, color: "Black and Tan" }],
  },
  {
    id: "507f1f77bcf86cd799439013",
    name: "Ahmad Hidayat",
    email: "ahmad.hidayat@email.com",
    phone: "081234567892",
    address: "Jl. Malioboro No. 78, Yogyakarta, Indonesia",
    coordinates: { lat: -7.7956, lng: 110.3695 },
    joinDate: "2021-01-30",
    dogs: [
      { id: 4, name: "Bella", breed: "Poodle", age: 1, color: "White" },
      { id: 5, name: "Charlie", breed: "Beagle", age: 2, color: "Tricolor" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439014",
    name: "Maya Wijaya",
    email: "maya.wijaya@email.com",
    phone: "081234567893",
    address: "Jl. Pemuda No. 90, Surabaya, Indonesia",
    coordinates: { lat: -7.2575, lng: 112.7521 },
    joinDate: "2022-05-15",
    dogs: [{ id: 6, name: "Milo", breed: "Shih Tzu", age: 3, color: "Brown and White" }],
  },
  {
    id: "507f1f77bcf86cd799439015",
    name: "Rudi Hartono",
    email: "rudi.hartono@email.com",
    phone: "081234567894",
    address: "Jl. Ahmad Yani No. 56, Medan, Indonesia",
    coordinates: { lat: 3.5952, lng: 98.6722 },
    joinDate: "2020-11-08",
    dogs: [
      { id: 7, name: "Cooper", breed: "Labrador", age: 2, color: "Chocolate" },
      { id: 8, name: "Bailey", breed: "Corgi", age: 1, color: "Fawn" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439016",
    name: "Diana Putri",
    email: "diana.putri@email.com",
    phone: "081234567895",
    address: "Jl. Diponegoro No. 34, Semarang, Indonesia",
    coordinates: { lat: -6.9932, lng: 110.4203 },
    joinDate: "2021-09-20",
    dogs: [{ id: 9, name: "Lucy", breed: "Chihuahua", age: 2, color: "Tan" }],
  },
  {
    id: "507f1f77bcf86cd799439017",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    phone: "081234567896",
    address: "Jl. Gajah Mada No. 67, Denpasar, Indonesia",
    coordinates: { lat: -8.6525, lng: 115.2189 },
    joinDate: "2019-12-05",
    dogs: [{ id: 10, name: "Zeus", breed: "Rottweiler", age: 3, color: "Black and Mahogany" }],
  },
  {
    id: "507f1f77bcf86cd799439018",
    name: "Linda Susanto",
    email: "linda.susanto@email.com",
    phone: "081234567897",
    address: "Jl. Veteran No. 89, Makassar, Indonesia",
    coordinates: { lat: -5.1477, lng: 119.4327 },
    joinDate: "2022-03-12",
    dogs: [
      { id: 11, name: "Daisy", breed: "Pomeranian", age: 1, color: "Orange" },
      { id: 12, name: "Duke", breed: "Bulldog", age: 2, color: "White and Brown" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439019",
    name: "Hendra Wijaya",
    email: "hendra.wijaya@email.com",
    phone: "081234567898",
    address: "Jl. Pahlawan No. 23, Palembang, Indonesia",
    coordinates: { lat: -2.9761, lng: 104.7754 },
    joinDate: "2020-08-25",
    dogs: [{ id: 13, name: "Shadow", breed: "Great Dane", age: 2, color: "Black" }],
  },
  {
    id: "507f1f77bcf86cd799439020",
    name: "Nina Sari",
    email: "nina.sari@email.com",
    phone: "081234567899",
    address: "Jl. Merdeka No. 12, Manado, Indonesia",
    coordinates: { lat: 1.4748, lng: 124.8421 },
    joinDate: "2021-06-18",
    dogs: [{ id: 14, name: "Oliver", breed: "Dachshund", age: 1, color: "Red" }],
  },
  {
    id: "507f1f77bcf86cd799439021",
    name: "Agus Setiawan",
    email: "agus.setiawan@email.com",
    phone: "081234567810",
    address: "Jl. Asia Afrika No. 45, Bandung, Indonesia",
    coordinates: { lat: -6.9175, lng: 107.6191 },
    joinDate: "2022-01-05",
    dogs: [{ id: 15, name: "Molly", breed: "Yorkshire Terrier", age: 2, color: "Brown and Black" }],
  },
  {
    id: "507f1f77bcf86cd799439022",
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    phone: "081234567811",
    address: "Jl. Gatot Subroto No. 67, Jakarta, Indonesia",
    coordinates: { lat: -6.2441, lng: 106.8346 },
    joinDate: "2020-04-30",
    dogs: [
      { id: 16, name: "Buddy", breed: "French Bulldog", age: 1, color: "Brindle" },
      { id: 17, name: "Coco", breed: "Maltese", age: 3, color: "White" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439023",
    name: "Rizki Pratama",
    email: "rizki.pratama@email.com",
    phone: "081234567812",
    address: "Jl. Imam Bonjol No. 34, Surabaya, Indonesia",
    coordinates: { lat: -7.2575, lng: 112.7521 },
    joinDate: "2021-11-15",
    dogs: [{ id: 18, name: "Leo", breed: "Chow Chow", age: 2, color: "Red" }],
  },
  {
    id: "507f1f77bcf86cd799439024",
    name: "Anita Wijaya",
    email: "anita.wijaya@email.com",
    phone: "081234567813",
    address: "Jl. Hayam Wuruk No. 78, Semarang, Indonesia",
    coordinates: { lat: -6.9932, lng: 110.4203 },
    joinDate: "2019-09-08",
    dogs: [{ id: 19, name: "Ruby", breed: "Doberman", age: 3, color: "Black and Rust" }],
  },
  {
    id: "507f1f77bcf86cd799439025",
    name: "Bambang Kusuma",
    email: "bambang.kusuma@email.com",
    phone: "081234567814",
    address: "Jl. Raya Kuta No. 90, Denpasar, Indonesia",
    coordinates: { lat: -8.7224, lng: 115.1726 },
    joinDate: "2022-02-28",
    dogs: [
      { id: 20, name: "Thor", breed: "Alaskan Malamute", age: 2, color: "Grey and White" },
      { id: 21, name: "Loki", breed: "Border Collie", age: 1, color: "Black and White" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439026",
    name: "Kartika Sari",
    email: "kartika.sari@email.com",
    phone: "081234567815",
    address: "Jl. Panglima Sudirman No. 56, Malang, Indonesia",
    coordinates: { lat: -7.9797, lng: 112.6304 },
    joinDate: "2020-07-12",
    dogs: [{ id: 22, name: "Pepper", breed: "Dalmatian", age: 2, color: "White and Black" }],
  },
  {
    id: "507f1f77bcf86cd799439027",
    name: "Surya Darma",
    email: "surya.darma@email.com",
    phone: "081234567816",
    address: "Jl. Urip Sumoharjo No. 23, Makassar, Indonesia",
    coordinates: { lat: -5.1477, lng: 119.4327 },
    joinDate: "2021-03-20",
    dogs: [
      { id: 23, name: "Ziggy", breed: "Pug", age: 1, color: "Fawn" },
      { id: 24, name: "Nala", breed: "Samoyed", age: 2, color: "White" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439028",
    name: "Yanti Permata",
    email: "yanti.permata@email.com",
    phone: "081234567817",
    address: "Jl. Sudirman No. 45, Pekanbaru, Indonesia",
    coordinates: { lat: 0.507, lng: 101.4478 },
    joinDate: "2022-04-05",
    dogs: [{ id: 25, name: "Bentley", breed: "Bernese Mountain Dog", age: 3, color: "Tricolor" }],
  },
  {
    id: "507f1f77bcf86cd799439029",
    name: "Irfan Hakim",
    email: "irfan.hakim@email.com",
    phone: "081234567818",
    address: "Jl. Gajah Mada No. 89, Yogyakarta, Indonesia",
    coordinates: { lat: -7.7956, lng: 110.3695 },
    joinDate: "2020-10-15",
    dogs: [
      { id: 26, name: "Mochi", breed: "Japanese Spitz", age: 1, color: "White" },
      { id: 27, name: "Kopi", breed: "Belgian Malinois", age: 2, color: "Fawn" },
    ],
  },
  {
    id: "507f1f77bcf86cd799439030",
    name: "Ratna Dewi",
    email: "ratna.dewi@email.com",
    phone: "081234567819",
    address: "Jl. Diponegoro No. 67, Medan, Indonesia",
    coordinates: { lat: 3.5952, lng: 98.6722 },
    joinDate: "2021-08-30",
    dogs: [{ id: 28, name: "Storm", breed: "Australian Shepherd", age: 2, color: "Blue Merle" }],
  },
];
