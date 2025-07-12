export type ChatArr = Array<{ received: boolean, message: string, timestamp: number }>

type User = {
  _id: string
  name: string
  email: string
  profile_pic?: string
  profile_pic_id?: string
}

export type Messages = Array<{
  _id: string
  content: string
  sender: User
  receiver: User
  createdAt: string
}>

export const chatArr: Array<{ received: boolean, message: string, timestamp: number }> = [
  { received: true, message: "Hey, you up?", timestamp: 1720065600000 },
  { received: true, message: "Need help with something real quick.", timestamp: 1720065660000 },

  { received: false, message: "Yo, yeah I'm here.", timestamp: 1720065720000 },
  { received: false, message: "What's going on?", timestamp: 1720065770000 },

  { received: true, message: "My build is failing, can’t figure out why.", timestamp: 1720065820000 },
  { received: true, message: "It was working fine yesterday.", timestamp: 1720065900000 },

  { received: false, message: "You pull the latest from dev?", timestamp: 1720065980000 },
  { received: false, message: "There were some updates to the config file.", timestamp: 1720066060000 },

  { received: true, message: "Damn, I forgot to pull. One sec.", timestamp: 1720066120000 },

  { received: false, message: "No worries. Happened to me last week too lol.", timestamp: 1720066200000 },
  { received: false, message: "You should be good after that.", timestamp: 1720066260000 },

  { received: true, message: "Yeah, it's building now. You're a lifesaver 😂", timestamp: 1720066320000 },

  { received: false, message: "Haha anytime 😎", timestamp: 1720066380000 },

  { received: true, message: "BTW, are we still doing the sync later?", timestamp: 1720066460000 },
  { received: true, message: "Or is it rescheduled?", timestamp: 1720066500000 },

  { received: false, message: "Still on at 4pm.", timestamp: 1720066560000 },
  { received: false, message: "Don't forget to bring up the loading spinner bug.", timestamp: 1720066640000 },

  { received: true, message: "Noted. Thanks for the reminder.", timestamp: 1720066700000 },

  { received: false, message: "Cool. See you in the call.", timestamp: 1720066800000 },
  { received: false, message: "Gonna grab lunch real quick.", timestamp: 1720066860000 },

  { received: true, message: "Enjoy! Catch you in a bit.", timestamp: 1720066920000 }
];
