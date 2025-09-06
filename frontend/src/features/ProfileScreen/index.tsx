import HomeLayout from '@/features/home/HomeLayout'

const ProfileScreen = () => {
  return (
    <HomeLayout>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Profil</h2>
        <p>Kullanıcı profil bilgileri burada görüntülenecek.</p>
        <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Profil Detayları</h3>
          <p>Email, ad, soyad ve diğer kullanıcı bilgileri burada yer alacak.</p>
        </div>
      </div>
    </HomeLayout>
  )
}

export default ProfileScreen
