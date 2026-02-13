# 모달 컴포넌트 가이드

## 📁 모달 컴포넌트 목록

### BaseModal
기본 모달 컴포넌트. 모든 모달의 베이스가 되는 공통 모달 기능을 제공합니다.

```tsx
import { BaseModal } from '@components/common/modals/BaseModal';

<BaseModal visible={true} onClose={() => {}} title="제목">
  <Text>모달 내용</Text>
</BaseModal>
```

### ConfirmModal
확인/취소 모달. 사용자에게 확인을 받을 때 사용합니다.
cancelText="" 로 설정하면 '확인' 버튼만 보여집니다.

```tsx
import ConfirmModal from '@components/common/modals/ConfirmModal';

<ConfirmModal
  visible={true}
  onClose={() => {}}
  title="삭제"
  description="정말 삭제하시겠습니까?"
  onConfirm={() => {}}
  confirmText="삭제"
  cancelText="취소"
/>
```

### CounterCreateModal
카운터 생성 모달. 카운터만 생성할 때 사용합니다.

```tsx
import CounterCreateModal from '@components/common/modals/CounterCreateModal';

<CounterCreateModal
  visible={true}
  onClose={() => {}}
  onConfirm={(name) => {}}
  title="새 카운터 생성하기"
/>
```

### CounterEditModal
카운터 편집 모달. 기존 카운터의 이름을 수정할 때 사용합니다.

```tsx
import CounterEditModal from '@components/common/modals/CounterEditModal';

<CounterEditModal
  visible={true}
  onClose={() => {}}
  onConfirm={(name) => {}}
  initialValue="기존 카운터 이름"
  title="카운터 편집"
/>
```

### ProjectCreateModal
프로젝트 생성 모달. 프로젝트와 카운터를 함께 생성할 때 사용합니다.

```tsx
import ProjectCreateModal from '@components/common/modals/ProjectCreateModal';

<ProjectCreateModal
  visible={true}
  onClose={() => {}}
  onConfirm={(projectName, counterName) => {}}
  title="새 프로젝트 생성하기"
/>
```

### SlideModal
슬라이드 모달. 좌측에서 나오는 모달입니다.

```tsx
import { SlideModal } from '@components/common/modals/SlideModal';

<SlideModal
  height={300}
  handleWidth={40}
  backgroundColor="white"
  padding={20}
  onClose={() => {}}
>
  <Text>모달 내용</Text>
</SlideModal>
```

**Props:**
- `children`: 모달 내용 (필수)
- `height?`: 모달의 세로 길이 (기본값: 300)
- `handleWidth?`: 핸들의 가로 길이 (기본값: 40)
- `backgroundColor?`: 배경색 (기본값: white)
- `padding?`: 모달 내부 패딩 (기본값: 20)
- `top?`: 모달의 상단 위치 (기본값: '50%')
- `onClose?`: 닫기 콜백 (선택사항)