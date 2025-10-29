package com.example.backend.security;

import com.example.backend.models.Employee;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key; // <— importa tu modelo
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final Key key;
  private final long expirationMs;

  public JwtService(
    @Value("${app.jwt.secret}") String secret,
    @Value("${app.jwt.expiration-ms}") long expirationMs
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMs = expirationMs;
  }

  // 🔹 NUEVO: genera desde Employee para incluir id, role y name
  public String generate(Employee emp) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + expirationMs);

    return Jwts.builder()
      .setSubject(emp.getEmail()) // sub = email
      .claim("id", emp.getId()) // 👈 ID en el token
      .claim("role", emp.getRole().name())
      .claim("name", emp.getFullName())
      .setIssuedAt(now)
      .setExpiration(expiry)
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  // (Si quieres mantener helpers)
  public String extractUsername(String token) {
    return parse(token).getBody().getSubject();
  }

  public String extractRole(String token) {
    return parse(token).getBody().get("role", String.class);
  }

  public boolean isValid(String token) {
    try {
      parse(token);
      return true;
    } catch (JwtException e) {
      return false;
    }
  }

  private Jws<Claims> parse(String token) {
    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token);
  }
}
