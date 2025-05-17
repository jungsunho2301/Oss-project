package Oss.web_site.service;

import Oss.web_site.model.User;
import Oss.web_site.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public boolean register(String username, String password) {
        if (userRepository.existsByUsername(username)) return false;

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
        return true;
    }

    public boolean login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> encoder.matches(password, user.getPassword()))
                .orElse(false);
    }
}
