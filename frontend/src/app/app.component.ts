import { Component, OnInit } from '@angular/core';
import { SocketClientService } from './services/socket-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public socketClientService: SocketClientService) {}
  title = 'frontend';

  ngOnInit(): void {
    this.socketClientService.connect();
  }
}
