package com.example.backend.security;

import com.example.backend.repository.EmployeeRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final EmployeeRepository repo;

  public CustomUserDetailsService(EmployeeRepository repo) {
    this.repo = repo;
  }

  @Override
  public UserDetails loadUserByUsername(String username)
    throws UsernameNotFoundException {
    var emp = repo
      .findByEmail(username)
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    var authority =
      new org.springframework.security.core.authority.SimpleGrantedAuthority(
        "ROLE_" + emp.getRole().name()
      );

    return new User(
      emp.getEmail(),
      emp.getPassword(),
      java.util.List.of(authority)
    );
  }
}
