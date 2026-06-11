import { Injectable } from '@angular/core';
import { JwtTokenDto } from './dtos/jwt-token-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private isAuthenticated: boolean = false;
  private jwtToken: JwtTokenDto | null = null;

  public setAuthentication(token: JwtTokenDto): void {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }

  public clearAuthentication(): void {
    this.jwtToken = null;
    this.isAuthenticated = false;
  }

  public getJwtToken(): JwtTokenDto | null {
    return this.jwtToken;
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  constructor() { }
}
