export type UserDetails = {
  _id: string;
  firstName: string;
  lastName: string;
  user_email: string;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
  profile_pic: string;
  cover_pic: string;
  link: string;
  bio: string;
  followers: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profile_pic: string;
  }>;
  following: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profile_pic: string;
  }>;
}

export const defaultUserDetail: UserDetails = {
  _id: '',
  firstName: '',
  lastName: '',
  user_email: '',
  username: '',
  password: '',
  createdAt: 0,
  updatedAt: 0,
  profile_pic: '',
  cover_pic: '',
  link: '',
  bio: '',
  followers: new Array(),
  following: new Array(),
}

export const usersList: Array<UserDetails> = [
  {
    _id: "1",
    firstName: "Shobhit",
    lastName: "Raj",
    user_email: "shobhitraj34@gmail.com",
    username: "shobhitraj",
    password: "shohehe",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://pbs.twimg.com/profile_images/1742119092360998912/2G7XXDyq_400x400.jpg",
    cover_pic: "https://pbs.twimg.com/profile_banners/822058153051295745/1678301248/1500x500",
    link: "https://github.com/shobhit-28/",
    bio: "Software Developer",
    followers: [
      {
        _id: "2",
        firstName: "Rahul",
        lastName: "Mallick",
        username: "mallick",
        profile_pic: "https://staticg.sportskeeda.com/editor/2022/07/c2ed4-16587439752781.png",
      },
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      }
    ],
    following: [
      {
        _id: "2",
        firstName: "Rahul",
        lastName: "Mallick",
        username: "mallick",
        profile_pic: "https://staticg.sportskeeda.com/editor/2022/07/c2ed4-16587439752781.png",
      },
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      }
    ],
  },
  {
    _id: "2",
    firstName: "Rahul",
    lastName: "Mallick",
    user_email: "mallickrahul@gmail.com",
    username: "mallick",
    password: "1234abcd",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://staticg.sportskeeda.com/editor/2022/07/c2ed4-16587439752781.png",
    cover_pic: "",
    link: "https://mallickrahul.netlify.app",
    bio: "Singer",
    followers: [
      {
        _id: "1",
        firstName: "Shobhit",
        lastName: "Raj",
        username: "shobhitraj",
        profile_pic: "https://pbs.twimg.com/profile_images/1742119092360998912/2G7XXDyq_400x400.jpg",
      },
      {
        _id: "5",
        firstName: "Eklavya",
        lastName: "Prasad",
        username: "eklavya",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650009611/uchicha_crest_ngetfr.jpg",
      }
    ],
    following: [
      {
        _id: "1",
        firstName: "Shobhit",
        lastName: "Raj",
        username: "shobhitraj",
        profile_pic: "https://pbs.twimg.com/profile_images/1742119092360998912/2G7XXDyq_400x400.jpg",
      },
      {
        _id: "5",
        firstName: "Eklavya",
        lastName: "Prasad",
        username: "eklavya",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650009611/uchicha_crest_ngetfr.jpg",
      }
    ],
  },
  {
    _id: "3",
    firstName: "Ayush",
    lastName: "Singh",
    user_email: "singhayush@gmail.com",
    username: "ayush",
    password: "1234abcd",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
    cover_pic: "",
    link: "https://singhayush.netlify.app",
    bio: "Automotive Designer",
    followers: [
      {
        _id: "4",
        firstName: "Saurabh",
        lastName: "Kumar",
        username: "saurabh",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022195/saitama_isaxm6.jpg",
      },
      {
        _id: "5",
        firstName: "Eklavya",
        lastName: "Prasad",
        username: "eklavya",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650009611/uchicha_crest_ngetfr.jpg",
      },
      {
        _id: "1",
        firstName: "Shobhit",
        lastName: "Raj",
        username: "shobhitraj",
        profile_pic: "https://pbs.twimg.com/profile_images/1742119092360998912/2G7XXDyq_400x400.jpg",
      }
    ],
    following: [
      {
        _id: "1",
        firstName: "Shobhit",
        lastName: "Raj",
        username: "shobhitraj",
        profile_pic: "https://pbs.twimg.com/profile_images/1742119092360998912/2G7XXDyq_400x400.jpg",
      },
      {
        _id: "4",
        firstName: "Saurabh",
        lastName: "Kumar",
        username: "saurabh",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022195/saitama_isaxm6.jpg",
      },
      {
        _id: "6",
        firstName: "Nitin",
        lastName: "Lakra",
        username: "tintin",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022195/one_piece_2_jcjkvz.jpg",
      },
      {
        _id: "5",
        firstName: "Eklavya",
        lastName: "Prasad",
        username: "eklavya",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650009611/uchicha_crest_ngetfr.jpg",
      },
    ],
  },
  {
    _id: "4",
    firstName: "Saurabh",
    lastName: "Kumar",
    username: "saurabh",
    user_email: "kumarsaurabh@gmail.com",
    password: "1234abcd",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022195/saitama_isaxm6.jpg",
    cover_pic: "",
    link: "https://kumarsaurabhssm.netlify.app",
    bio: "bank manager",
    followers: [
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      },
    ],
    following: [
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      },
    ],
  },
  {
    _id: "5",
    firstName: "Eklavya",
    lastName: "Prasad",
    username: "eklavya",
    user_email: "eklavyapd@gmail.com",
    password: "1234abcd",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650009611/uchicha_crest_ngetfr.jpg",
    cover_pic: "",
    link: "https://pdeklavya.netlify.app",
    bio: "App Developer",
    followers: [
      {
        _id: "2",
        firstName: "Rahul",
        lastName: "Mallick",
        username: "mallick",
        profile_pic: "https://staticg.sportskeeda.com/editor/2022/07/c2ed4-16587439752781.png",
      },
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      },
    ],
    following: [
      {
        _id: "2",
        firstName: "Rahul",
        lastName: "Mallick",
        username: "mallick",
        profile_pic: "https://staticg.sportskeeda.com/editor/2022/07/c2ed4-16587439752781.png"
      },
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      },
    ],
  },
  {
    _id: "6",
    firstName: "Nitin",
    lastName: "Lakra",
    username: "tintin",
    user_email: "nitintin@gmail.com",
    password: "1234abcd",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022195/one_piece_2_jcjkvz.jpg",
    cover_pic: "",
    link: "https://lakranitin.netlify.app",
    bio: "Gamer",
    followers: [
      {
        _id: "3",
        firstName: "Ayush",
        lastName: "Singh",
        username: "ayush",
        profile_pic: "https://res.cloudinary.com/randomwave45/image/upload/v1650022196/one_piece_1_anib9s.jpg",
      },
    ],
    following: [],
  },
];
