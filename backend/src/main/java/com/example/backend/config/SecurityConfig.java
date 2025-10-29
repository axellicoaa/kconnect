package com.example.backend.config;

import com.example.backend.security.JwtAuthFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      // usa explícitamente la source de CORS
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .sessionManagement(sm ->
        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth ->
        auth
          // 🔓 permite TODO OPTIONS (preflight)
          .requestMatchers(HttpMethod.OPTIONS, "/**")
          .permitAll()
          // 🔓 abre /auth/**
          .requestMatchers("/auth/**")
          .permitAll()
          // swagger abierto
          .requestMatchers(
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
          )
          .permitAll()
          // resto de tus reglas
          .requestMatchers("/users/**")
          .hasRole("ADMIN")
          // Empleados
          .requestMatchers(HttpMethod.GET, "/kconnect/employees/{id}")
          .hasAnyRole("ADMIN", "EMPLOYEE") // pero ojo: valida que solo vea el suyo
          .requestMatchers(HttpMethod.GET, "/kconnect/employees")
          .hasRole("ADMIN") // solo lista completa
          .requestMatchers(HttpMethod.POST, "/kconnect/employees")
          .hasRole("ADMIN")
          .requestMatchers(HttpMethod.PUT, "/kconnect/employees/{id}")
          .hasAnyRole("ADMIN", "EMPLOYEE") // admin o el propio usuario
          .requestMatchers(HttpMethod.DELETE, "/kconnect/employees/{id}")
          .hasRole("ADMIN")
          .requestMatchers(HttpMethod.GET, "/kconnect/departments/**")
          .hasAnyRole("ADMIN", "EMPLOYEE")
          .requestMatchers(HttpMethod.POST, "/kconnect/departments/**")
          .hasRole("ADMIN")
          .requestMatchers(HttpMethod.PUT, "/kconnect/departments/**")
          .hasRole("ADMIN")
          .requestMatchers(HttpMethod.DELETE, "/kconnect/departments/**")
          .hasRole("ADMIN")
          .requestMatchers(HttpMethod.GET, "/kconnect/reports/**")
          .hasAnyRole("ADMIN", "EMPLOYEE")
          .requestMatchers(HttpMethod.POST, "/kconnect/reports/**")
          .hasAnyRole("ADMIN", "EMPLOYEE")
          .requestMatchers(HttpMethod.PUT, "/kconnect/reports/**")
          .hasAnyRole("ADMIN", "EMPLOYEE")
          .requestMatchers(HttpMethod.DELETE, "/kconnect/reports/**")
          .hasRole("ADMIN")
          .anyRequest()
          .authenticated()
      )
      .addFilterBefore(
        jwtAuthFilter,
        UsernamePasswordAuthenticationFilter.class
      )
      .build();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration cfg)
    throws Exception {
    return cfg.getAuthenticationManager();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cors = new CorsConfiguration();

    // Acepta todas las origins de localhost
    cors.setAllowedOriginPatterns(
      List.of("http://localhost:3000", "http://127.0.0.1:3000")
    );
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(List.of("*")); // muy importante
    cors.setExposedHeaders(List.of("Authorization"));
    cors.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
      new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cors);
    return source;
  }
}
