package com.masar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${masar.cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // profile endpoints need a logged-in user, even though they live
                // under /api/auth - this rule must come BEFORE the broader
                // /api/auth/** permitAll below, since Spring Security matches
                // requestMatchers in order and the first match wins.
                .requestMatchers("/api/auth/me", "/api/auth/change-password").authenticated()
                // public: reading guide content, sponsors, and the rest of auth (login, register, reset, etc.)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/sections/**").permitAll()
                .requestMatchers("/api/sponsors/**").permitAll()
                .requestMatchers("/api/universities/**").permitAll()
                // Community headline counts are public (a guest should see "why join"
                // before creating an account) - must come before the broader
                // /api/community/** authenticated rule below, same ordering reason as
                // /api/auth/me above.
                .requestMatchers("/api/community/counts").permitAll()
                .requestMatchers("/api/community/**").authenticated()
                // Browsing city-wide activity pins/cards is public, same reasoning as
                // community counts above; creating/RSVPing still needs a login (see
                // ActivityController) - this specific rule must come before the
                // broader /api/activities/** authenticated rule right below it.
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/activities/city").permitAll()
                .requestMatchers("/api/activities/**").authenticated()
                // Browsing real OSM venues (list + single place) is public too; only
                // the manual re-sync endpoint needs a login, so that one specific
                // rule must come before the general GET permitAll below it.
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/places/sync").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/places/**").permitAll()
                .requestMatchers("/api/location/**").authenticated()
                .requestMatchers("/api/students/**").authenticated()
                // requires a logged-in user: personal checklist progress, PDF export
                .requestMatchers("/api/checklist/**").authenticated()
                .requestMatchers("/api/export/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Patterns (not just exact origins) so the dev frontend works from a phone
        // on the same Wi-Fi too - Vite's --host picks whatever LAN IP/port are
        // free, which changes machine to machine and even run to run.
        config.setAllowedOriginPatterns(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
