import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)

    # Serialize
    @property
    def serialize(self):
        return {
                'id': self.id,
                'username': self.username,
                'email': self.email,
              }


class PracticeVerticals(Base):
    __tablename__ = 'practice verticals'

    id = Column(Integer, primary_key=True)

    # Business Content Analysis
    bca_cm = Column(Boolean, nullable=False)
    bca_pm = Column(Boolean, nullable=False)
    bca_pd = Column(Boolean, nullable=False)
    bca_bi = Column(Boolean, nullable=False)
    bca_m = Column(Boolean, nullable=False)
    bca_bm = Column(Boolean, nullable=False)

    # Usability Engineering
    ue_s = Column(Boolean, nullable=False)
    ue_pr = Column(Boolean, nullable=False)
    ue_t = Column(Boolean, nullable=False)
    ue_l = Column(Boolean, nullable=False)
    ue_rd = Column(Boolean, nullable=False)
    ue_a = Column(Boolean, nullable=False)

    # User Experience Planning
    uep_uxb = Column(Boolean, nullable=False)
    uep_p = Column(Boolean, nullable=False)
    uep_ed = Column(Boolean, nullable=False)
    uep_uxm = Column(Boolean, nullable=False)
    uep_uxs = Column(Boolean, nullable=False)
    uep_r = Column(Boolean, nullable=False)

    # Content Publishing
    cp_c = Column(Boolean, nullable=False)   
    cp_e = Column(Boolean, nullable=False) 
    cp_g = Column(Boolean, nullable=False) 
    cp_cm = Column(Boolean, nullable=False) 
    cp_cs = Column(Boolean, nullable=False) 
    cp_cs = Column(Boolean, nullable=False) 

    # Information Architecure 
    ia_n = Column(Boolean, nullable=False)
    ia_io = Column(Boolean, nullable=False)
    ia_ir = Column(Boolean, nullable=False)    
    ia_iam = Column(Boolean, nullable=False)
    ia_ias = Column(Boolean, nullable=False)
    ia_ra = Column(Boolean, nullable=False)

    # Interaction Design
    id_w = Column(Boolean, nullable=False)
    id_i = Column(Boolean, nullable=False)
    id_p = Column(Boolean, nullable=False)
    id_c = Column(Boolean, nullable=False)
    id_ds = Column(Boolean, nullable=False)
    id_ra = Column(Boolean, nullable=False)

    # Visual & Information Design
    vid_g = Column(Boolean, nullable=False)
    vid_l = Column(Boolean, nullable=False)   
    vid_sg = Column(Boolean, nullable=False)
    vid_ad = Column(Boolean, nullable=False)
    vid_cs = Column(Boolean, nullable=False)
    vid_ra = Column(Boolean, nullable=False) 

    # Computer Science
    cs_fec = Column(Boolean, nullable=False)   
    cs_dd = Column(Boolean, nullable=False)    
    cs_sc = Column(Boolean, nullable=False)   
    cs_i = Column(Boolean, nullable=False)   
    cs_sa = Column(Boolean, nullable=False)   
    cs_ra = Column(Boolean, nullable=False)     

    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship(User)

    # Serialize
    @property
    def serialize(self):
        return {
                 "Business Context Analysis":{
                    "Context Map":self.bca_cm,
                    "Performance Measures":self.bca_pm,
                    "Product / Service Definitions":self.bca_pd,
                    "Business Intent":self.bca_bi,
                    "Mission / Vision":self.bca_m,
                    "Business Model":self.bca_bm
                 },
                 "Usability Engineering":{
                    "Synthesis":self.ue_s,
                    "Primary Research":self.ue_pr,
                    "Testing":self.ue_t,
                    "Logistics":self.ue_l,
                    "Research Design":self.ue_rd,
                    "Analytics":self.ue_a
                 },
                 "User Experience Planning":{
                    "UX Brief":self.uep_uxb,
                    "Personas":self.uep_p,
                    "Engagement Definitions":self.uep_ed,
                    "UX Management":self.uep_uxm,
                    "UX Strategy":self.uep_uxs,
                    "Research":self.uep_r
                 },
                 "Content Publishing":{
                    "Content":self.cp_c,
                    "Editing":self.cp_e,
                    "Governance":self.cp_g,
                    "Content Management":self.cp_cm,
                    "Content Strategy":self.cp_cs,
                    "Research / Analytics":self.cp_ra
                 },
                 "Information Architecture":{
                    "Navigation":self.ia_n,
                    "Information Organization":self.ia_io,
                    "Information Relationship":self.ia_ir,
                    "IA Management":self.ia_iam,
                    "IA Strategy":self.ia_ias,
                    "Research / Analytics":self.ia_ra
                 },
                 "Interaction Design":{
                    "Wireframe":self.id_w,
                    "Interaction":self.id_i,
                    "Patterns":self.id_p,
                    "Conventions":self.id_c,
                    "Device Strategy":self.id_ds,
                    "Research / Analytics":self.id_ra
                 },
                 "Visual & Information Design":{
                    "Graphics":self.vid_g,
                    "Layout":self.vid_l,
                    "Style Guide":self.vid_sg,
                    "Art Direction":self.vid_ad,
                    "Creative Strategy":self.vid_cs,
                    "Research / Analytics":self.vid_ra
                 },
                 "Computer Science":{
                    "Front-end Code":self.cs_fec,
                    "Database Design":self.cs_dd,
                    "Server Code":self.cs_sc,
                    "Infrastructure":self.cs_i,
                    "System Architecture":self.cs_sa,
                    "Research / Analytics":self.cs_ra
                 }
            }

#engine = create_engine('sqlite:///rubyscostarica.db')
engine = create_engine('postgres://pdiklqkuhjdrnx:upgNacOIGqj7Wn45DtVJygSMB6@ec2-54-197-253-142.compute-1.amazonaws.com:5432/d28h82c038hd3s')

Base.metadata.create_all(engine)
