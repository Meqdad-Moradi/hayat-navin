import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../navigations/header/header';

@Component({
  imports: [RouterOutlet, Header],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {}
