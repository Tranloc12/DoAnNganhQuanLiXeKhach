///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.MemberInfo;
//import com.nhom12.repositories.MemberInfoRepository;
//import com.nhom12.services.MemberInfoService;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
///**
// *
// * @author HP
// */
//@Service
//public class MemberInfoServiceImpl implements MemberInfoService {
//
//    @Autowired
//    private MemberInfoRepository memRepo;
//
//    @Override
//    public List<MemberInfo> getAllMembers() {
//        return memRepo.getAllMembers();
//    }
//
//    @Override
//    public MemberInfo addMemberInfo(MemberInfo mem) {
//        return memRepo.addMemberInfo(mem);
//    }
//
//    @Override
//    public MemberInfo getMemberInfoByUserId(Integer id) {
//        return memRepo.getMemberInfoByUserId(id);
//    }
//
//    @Override
//    public MemberInfo getMemberInfoById(int id) {
//        return memRepo.getMemberInfoById(id);
//    }
//
//}
