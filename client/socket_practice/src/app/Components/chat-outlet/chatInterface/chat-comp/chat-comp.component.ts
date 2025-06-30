import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserDetails } from '../../../../DTO/users.dto';
import { MatIcon } from '@angular/material/icon';
import { ChatComponent } from "../../../../Pages/chat/chat.component";
import { ChatTextComponent } from "./chat-text/chat-text.component";
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-chat-comp',
  standalone: true,
  imports: [
    MatIcon,
    ChatTextComponent,
    FormsModule
  ],
  templateUrl: './chat-comp.component.html',
  styleUrl: './chat-comp.component.css'
})
export class ChatCompComponent {
  @Input() user!: UserDetails

  chatArr: Array<{ received: boolean, message: string, timestamp: number }> = [
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
  message: string | null = null

  private chatService = inject(ChatService)

  back() {
    this.chatService.clearSelection()
  }

  sendMessage(chatForm: NgForm, userId: string) {
    this.chatService.sendMessage(chatForm.value, userId)
  }

  getMessages(userId: string) {
    return this.chatService.getMessagesForUser(userId)
  }
}
