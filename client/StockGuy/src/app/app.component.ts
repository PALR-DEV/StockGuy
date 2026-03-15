import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from "./shared-components/navbar/navbar-component/navbar-component";
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'StockGuy';
  private readonly http = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    const response = await firstValueFrom(this.http.get('/api/stocks/most-active'));
    console.log(response);
  }
}
