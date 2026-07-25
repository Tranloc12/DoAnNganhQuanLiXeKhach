import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "123456";
        String encodedPassword = "$2a$10$dnnQ/p.DiynV8eUoqStlrejnHz75NCaJaYceOSdih0meXyFyU8J/a";
        boolean isMatch = encoder.matches(rawPassword, encodedPassword);
        System.out.println("Match: " + isMatch);
        System.out.println("New Hash: " + encoder.encode(rawPassword));
    }
}
