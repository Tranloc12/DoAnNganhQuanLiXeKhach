/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.nhom12.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    // Dùng userId/username làm public_id để mỗi user có 1 avatar duy nhất
    public String uploadFile(MultipartFile file, String userId) throws IOException {
        try {
            Map uploadResult = this.cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "public_id", "avatars/" + userId, // Lưu vào thư mục avatars
                    "overwrite", true
                )
            );

            // 👉 Luôn trả về HTTPS link
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lỗi khi tải ảnh lên Cloudinary", e);
        }
    }
}